"""
Dataset Preparation Pipeline for TrustWrite AI (Phase 1A).

This module ingests raw CSV datasets, standardizes schema and labels, performs
deterministic cleaning and deduplication, filters short texts (<30 words),
calculates word-count and quality metrics, and outputs clean datasets and reports.

Usage:
    python backend/training/prepare_dataset.py [--input PATH] [--output PATH] [--report PATH]
"""

import argparse
import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional

import pandas as pd

# Default Paths
DEFAULT_RAW_DIR = Path("backend/data/raw")
DEFAULT_PROCESSED_DIR = Path("backend/data/processed")
DEFAULT_OUTPUT_CSV = DEFAULT_PROCESSED_DIR / "essays_processed.csv"
DEFAULT_REPORT_JSON = DEFAULT_PROCESSED_DIR / "dataset_report.json"

# Supported column mappings
TEXT_COLUMN_CANDIDATES = ["text", "essay", "content", "response"]
LABEL_COLUMN_CANDIDATES = ["label", "class", "target"]

# Label normalization mappings
HUMAN_LABEL_VARIANTS = {"human", "h", "human_text", "human_essay", "human-essay"}
AI_LABEL_VARIANTS = {
    "ai",
    "generated",
    "machine",
    "machine-generated",
    "machine_generated",
    "ai_text",
    "ai_essay",
    "ai-essay",
}

REQUIRED_COLUMNS = ["text", "label", "source", "domain", "generator", "prompt_id"]
MIN_WORD_COUNT = 30


def ensure_directories(raw_dir: Path, processed_dir: Path) -> None:
    """Ensure raw and processed directories exist."""
    raw_dir.mkdir(parents=True, exist_ok=True)
    processed_dir.mkdir(parents=True, exist_ok=True)


def detect_column(df_columns: List[str], candidates: List[str]) -> Optional[str]:
    """Find matching column name case-insensitively or by exact match."""
    cols_lower = {str(col).lower(): str(col) for col in df_columns}
    for candidate in candidates:
        if candidate.lower() in cols_lower:
            return cols_lower[candidate.lower()]
    return None


def normalize_label(raw_label: Any) -> Optional[str]:
    """Normalize raw label string to 'human' or 'ai'. Returns None if label is invalid."""
    if pd.isna(raw_label):
        return None
    val = str(raw_label).strip().lower()
    if val in HUMAN_LABEL_VARIANTS:
        return "human"
    elif val in AI_LABEL_VARIANTS:
        return "ai"
    return None


def normalize_whitespace(text: str) -> str:
    """
    Normalize whitespace (collapsing multiple spaces, newlines, tabs into a single space)
    while preserving exact punctuation, casing, sentence boundaries, and word forms.

    WHY: Normalizing irregular whitespace ensures consistent word boundary splitting
    and duplicate detection while preserving linguistic/stylometric markers required
    for feature extraction.
    """
    return re.sub(r"\s+", " ", text).strip()


def calculate_word_stats(df: pd.DataFrame, label: Optional[str] = None) -> Dict[str, Any]:
    """Calculate word count statistics (min, median, max, mean) for text samples."""
    if label:
        subset = df[df["label"] == label]
    else:
        subset = df

    if subset.empty or "text" not in subset.columns:
        return {"min": 0, "median": 0.0, "max": 0, "mean": 0.0}

    word_counts = subset["text"].apply(lambda t: len(str(t).split()))
    if word_counts.empty:
        return {"min": 0, "median": 0.0, "max": 0, "mean": 0.0}

    return {
        "min": int(word_counts.min()),
        "median": round(float(word_counts.median()), 2),
        "max": int(word_counts.max()),
        "mean": round(float(word_counts.mean()), 2),
    }


def prepare_dataset(
    input_path: Path,
    output_path: Path,
    report_path: Path,
) -> None:
    """
    Main dataset preparation pipeline.
    """
    raw_dir = input_path if input_path.suffix.lower() != ".csv" else input_path.parent
    processed_dir = output_path.parent
    ensure_directories(raw_dir, processed_dir)

    # Collect source CSV files
    csv_files: List[Path] = []
    if input_path.is_dir() or input_path.suffix.lower() != ".csv":
        csv_files = sorted(list(raw_dir.glob("*.csv")))
    elif input_path.is_file() and input_path.suffix.lower() == ".csv":
        csv_files = [input_path]

    if not csv_files:
        formatted_input_dir = str(input_path).replace("\\", "/").rstrip("/") + "/"
        print(f"No CSV files found in {formatted_input_dir}. Add source CSV files there and run again.")
        return

    print(f"Found {len(csv_files)} source CSV file(s). Processing...")

    raw_dfs: List[pd.DataFrame] = []
    source_filenames: List[str] = []
    total_input_records = 0
    warnings: List[str] = []

    for file_path in csv_files:
        source_filenames.append(file_path.name)
        try:
            df_raw = pd.read_csv(file_path)
        except Exception as e:
            warnings.append(f"Could not read CSV file {file_path.name}: {str(e)}")
            continue

        file_record_count = len(df_raw)
        total_input_records += file_record_count

        # Detect columns
        text_col = detect_column(list(df_raw.columns), TEXT_COLUMN_CANDIDATES)
        label_col = detect_column(list(df_raw.columns), LABEL_COLUMN_CANDIDATES)

        if not text_col or not label_col:
            missing_col = "text" if not text_col else "label"
            warnings.append(
                f"Skipping {file_path.name}: missing required {missing_col} column (found columns: {list(df_raw.columns)})"
            )
            continue

        # Standardize DataFrame
        df_std = pd.DataFrame()
        df_std["text"] = df_raw[text_col]
        df_std["label_raw"] = df_raw[label_col]

        # Preserve or populate metadata fields
        default_source = file_path.stem
        df_std["source"] = df_raw["source"] if "source" in df_raw.columns else default_source
        df_std["domain"] = df_raw["domain"] if "domain" in df_raw.columns else ""
        df_std["generator"] = df_raw["generator"] if "generator" in df_raw.columns else ""
        df_std["prompt_id"] = df_raw["prompt_id"] if "prompt_id" in df_raw.columns else ""

        raw_dfs.append(df_std)

    if not raw_dfs:
        print("No valid data could be loaded from source CSV files.")
        report_data = {
            "total_input_records": total_input_records,
            "total_output_records": 0,
            "human_count": 0,
            "ai_count": 0,
            "class_distribution": {"human": 0, "ai": 0},
            "duplicates_removed": 0,
            "short_samples_removed": 0,
            "missing_text_removed": 0,
            "invalid_labels_removed": 0,
            "missing_source": 0,
            "missing_domain": 0,
            "missing_generator": 0,
            "missing_prompt_id": 0,
            "word_count_statistics": {
                "overall": {"min": 0, "median": 0.0, "max": 0, "mean": 0.0},
                "human": {"min": 0, "median": 0.0, "max": 0, "mean": 0.0},
                "ai": {"min": 0, "median": 0.0, "max": 0, "mean": 0.0},
            },
            "warnings": warnings,
            "source_files": source_filenames,
        }
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(report_data, f, indent=2)
        return

    combined_df = pd.concat(raw_dfs, ignore_index=True)

    # Step 1: Remove null / empty / whitespace-only text
    initial_count = len(combined_df)
    valid_text_mask = combined_df["text"].apply(
        lambda x: pd.notna(x) and bool(str(x).strip())
    )
    missing_text_removed = initial_count - int(valid_text_mask.sum())
    df_clean = combined_df[valid_text_mask].copy()
    df_clean["text"] = df_clean["text"].astype(str)

    # Step 2: Normalize labels and filter unrecognized labels
    df_clean["label"] = df_clean["label_raw"].apply(normalize_label)
    valid_label_mask = df_clean["label"].notna()
    invalid_labels_removed = int((~valid_label_mask).sum())
    if invalid_labels_removed > 0:
        warnings.append(f"Removed {invalid_labels_removed} records with invalid/unrecognized labels.")
    df_clean = df_clean[valid_label_mask].copy()

    # Step 3: Normalize whitespace (preserving casing, punctuation, word forms)
    df_clean["text"] = df_clean["text"].apply(normalize_whitespace)

    # Step 4: Deduplication (Exact + Normalized)
    count_before_dedup = len(df_clean)
    df_clean = df_clean.drop_duplicates(subset=["text"], keep="first").copy()

    # Conservative normalized duplicate removal (case-insensitive + whitespace collapsed)
    # WHY: Prevents identical texts with trivial capitalization differences from leaking across datasets/splits.
    df_clean["norm_text_key"] = df_clean["text"].apply(lambda t: t.lower().strip())
    df_clean = df_clean.drop_duplicates(subset=["norm_text_key"], keep="first").copy()
    df_clean = df_clean.drop(columns=["norm_text_key", "label_raw"])

    duplicates_removed = count_before_dedup - len(df_clean)

    # Step 5: Short text filtering (< 30 words)
    # WHY: Very short samples (<30 words) lack sufficient stylometric signal for robust AI classification.
    count_before_short = len(df_clean)
    df_clean["word_count"] = df_clean["text"].apply(lambda t: len(t.split()))
    df_clean = df_clean[df_clean["word_count"] >= MIN_WORD_COUNT].copy()
    short_samples_removed = count_before_short - len(df_clean)
    df_clean = df_clean.drop(columns=["word_count"])

    # Ensure required columns structure
    for col in REQUIRED_COLUMNS:
        if col not in df_clean.columns:
            df_clean[col] = ""

    df_output = df_clean[REQUIRED_COLUMNS].copy()

    # Save processed CSV dataset
    df_output.to_csv(output_path, index=False, encoding="utf-8")
    print(f"Processed dataset saved to: {output_path}")

    # Generate Metrics and JSON Report
    human_count = int((df_output["label"] == "human").sum())
    ai_count = int((df_output["label"] == "ai").sum())
    total_output_records = len(df_output)

    overall_stats = calculate_word_stats(df_output)
    human_stats = calculate_word_stats(df_output, label="human")
    ai_stats = calculate_word_stats(df_output, label="ai")

    # Count missing metadata
    missing_source = int((df_output["source"].isna() | (df_output["source"].astype(str).str.strip() == "")).sum())
    missing_domain = int((df_output["domain"].isna() | (df_output["domain"].astype(str).str.strip() == "")).sum())
    missing_generator = int((df_output["generator"].isna() | (df_output["generator"].astype(str).str.strip() == "")).sum())
    missing_prompt_id = int((df_output["prompt_id"].isna() | (df_output["prompt_id"].astype(str).str.strip() == "")).sum())

    # Length distribution check
    if human_count > 0 and ai_count > 0:
        human_med = human_stats["median"]
        ai_med = ai_stats["median"]
        diff = abs(human_med - ai_med)
        max_med = max(human_med, ai_med, 1.0)
        if diff / max_med > 0.25 or diff > 40:
            warnings.append(
                f"Length distribution imbalance detected: Human median word count is {human_med:.1f} "
                f"vs AI median word count of {ai_med:.1f}. Consider balancing text lengths to avoid "
                f"stylometric shortcut learning."
            )

    report_data = {
        "total_input_records": total_input_records,
        "total_output_records": total_output_records,
        "human_count": human_count,
        "ai_count": ai_count,
        "class_distribution": {"human": human_count, "ai": ai_count},
        "duplicates_removed": duplicates_removed,
        "short_samples_removed": short_samples_removed,
        "missing_text_removed": missing_text_removed,
        "invalid_labels_removed": invalid_labels_removed,
        "missing_source": missing_source,
        "missing_domain": missing_domain,
        "missing_generator": missing_generator,
        "missing_prompt_id": missing_prompt_id,
        "word_count_statistics": {
            "overall": overall_stats,
            "human": human_stats,
            "ai": ai_stats,
        },
        "warnings": warnings,
        "source_files": source_filenames,
    }

    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2)

    print(f"Dataset report saved to: {report_path}")
    print(
        f"Summary: Input Records: {total_input_records} | Output Records: {total_output_records} "
        f"(Human: {human_count}, AI: {ai_count})"
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Prepare and clean human vs AI essay dataset (Phase 1A).")
    parser.add_argument(
        "--input",
        type=str,
        default=str(DEFAULT_RAW_DIR),
        help="Input CSV file path or directory containing raw CSV files (default: backend/data/raw)",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=str(DEFAULT_OUTPUT_CSV),
        help="Output path for cleaned CSV dataset (default: backend/data/processed/essays_processed.csv)",
    )
    parser.add_argument(
        "--report",
        type=str,
        default=str(DEFAULT_REPORT_JSON),
        help="Output path for JSON dataset report (default: backend/data/processed/dataset_report.json)",
    )

    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)
    report_path = Path(args.report)

    prepare_dataset(input_path, output_path, report_path)


if __name__ == "__main__":
    main()
