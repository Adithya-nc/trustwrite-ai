import os
import joblib
import numpy as np
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional

from app.schemas.essay import (
    EssayAnalysisResponse, SentenceAnalysis, SentencePattern,
    WritingMetrics, WritingFingerprint, ParagraphRisk, Improvement,
    EssayCompareResponse, CompareSubjectScore, CompareSimilarityMetric
)
from app.services.feature_extractor import FeatureExtractor
from app.services.explanation_engine import ExplanationEngine

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "models", "essay_detector_v1.joblib")
MIN_WORD_COUNT = 50

FEATURE_NAMES = [
    'avg_sent_len', 'sent_len_std', 'burstiness', 'ttr', 'yules_k',
    'avg_word_len', 'function_word_ratio', 'pronoun_1st_ratio',
    'transition_word_ratio', 'passive_ratio', 'flesch_reading_ease',
    'gunning_fog', 'ngram_repetition_rate', 'para_len_var',
    'lexical_sophistication', 'sentence_starter_diversity',
    'contraction_ratio', 'punctuation_variety', 'pos_distribution_entropy'
]

class EssayAnalyzer:
    def __init__(self, spacy_nlp=None):
        self.feature_extractor = FeatureExtractor(spacy_nlp)
        self.explanation_engine = ExplanationEngine()
        self.model_loaded = False
        self.model_version = '1.0.0'
        self.scaler = None
        self.classifier = None
        self.model_metadata = {}
        self.active_feature_names = FEATURE_NAMES
        self._load_model()

    def _load_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                bundle = joblib.load(MODEL_PATH)
                self.scaler = bundle.get('scaler')
                self.classifier = bundle.get('classifier') or bundle.get('model')
                self.model_metadata = bundle.get('metrics', {})
                self.active_feature_names = bundle.get('feature_names', FEATURE_NAMES)
                self.model_loaded = True
                print(f"[OK] EssayDetector loaded successfully from {MODEL_PATH}")
            except Exception as e:
                print(f"[WARNING] Failed to load model from {MODEL_PATH}: {e}")
                self.model_loaded = False
                self.active_feature_names = FEATURE_NAMES
        else:
            print(f"[INFO] Model bundle not found at {MODEL_PATH}. Running in heuristic mode.")
            self.model_loaded = False
            self.active_feature_names = FEATURE_NAMES

    def analyze_essay(self, raw_text: str, essay_id: str = "ess_live") -> EssayAnalysisResponse:
        now_iso = datetime.now(timezone.utc).isoformat()
        words = self.feature_extractor.tokenize_words(raw_text)
        word_count = len(words)

        # Handle short text / insufficient input
        if word_count < MIN_WORD_COUNT:
            raw_sents = self.feature_extractor.split_sentences(raw_text)
            sent_analyses = []
            for idx, s in enumerate(raw_sents):
                sent_analyses.append(SentenceAnalysis(
                    id=f"s_{idx+1}",
                    index=idx,
                    text=s,
                    label="uncertain",
                    aiProbability=0.0,
                    confidence="low",
                    patterns=[],
                    explanation="Insufficient text length to establish reliable stylistic signals.",
                    suggestion=None,
                    paragraphIndex=0
                ))

            empty_metrics = WritingMetrics(
                vocabularyDiversity=0, sentenceVariation=0, sentenceComplexity=0,
                readability=0, grammar=0, passiveVoice=0, emotionalTone=0,
                vocabularyRichness=0, writingConsistency=0
            )
            empty_fingerprint = WritingFingerprint(
                vocabulary=0, sentenceRhythm=0, complexity=0, punctuation=0, formality=0, uniqueness=0
            )

            return EssayAnalysisResponse(
                essayId=essay_id,
                authenticityScore=50.0,
                aiProbability=0.0,
                confidence="low",
                evidenceStrength="Limited",
                classification="Insufficient Evidence",
                writingQuality=50.0,
                originality=50.0,
                sentences=sent_analyses,
                metrics=empty_metrics,
                fingerprint=empty_fingerprint,
                paragraphRisks=[],
                improvements=[
                    Improvement(
                        id="imp_1",
                        category="authenticity",
                        issue="Essay text is under 50 words.",
                        suggestion="Provide a longer text sample (at least 100–150 words) to enable meaningful statistical analysis.",
                        severity="medium"
                    )
                ],
                analyzedAt=now_iso,
                summary="The provided text is too short (< 50 words) for scientifically valid statistical AI detection.",
                whyThisResult="Statistical stylometry requires sufficient text length to measure sentence length variance, lexical diversity, and syntactic distributions.",
                genreObservation="Inconclusive",
                signals={"word_count": word_count, "min_required": MIN_WORD_COUNT},
                limitations=[
                    "Detection requires a minimum of 50 words for basic statistical feature extraction.",
                    "Short inputs are prone to high statistical variance."
                ]
            )

        # 1. Feature Extraction
        doc_feats, sent_feats_list, sentences = self.feature_extractor.extract_document_features(raw_text)
        num_sents = len(sentences)

        # 2. Multi-Signal Dimension Scoring (Each dimension 0 to 100 representing AI-like signal)
        # ─── Dimension A: Sentence Rhythm & Burstiness ───
        burst = doc_feats.get('burstiness', 0.5)
        if burst > 0.40:
            burst_signal = 10.0  # High variation -> very human
        elif burst > 0.25:
            burst_signal = 30.0  # Moderate variation -> human
        elif burst > 0.15:
            burst_signal = 65.0  # Low variation -> AI-like uniformity
        else:
            burst_signal = 85.0  # Extremely uniform -> strong AI signal

        # ─── Dimension B: Lexical Diversity & Repetition ───
        ttr = doc_feats.get('ttr', 0.5)
        ngram_rep = doc_feats.get('ngram_repetition_rate', 0.0)
        vocab_signal = 35.0
        if ttr > 0.75:
            vocab_signal -= 20.0
        elif ttr < 0.55:
            vocab_signal += 25.0
        if ngram_rep > 0.03:
            vocab_signal += 25.0
        vocab_signal = max(5.0, min(95.0, vocab_signal))

        # ─── Dimension C: Formal Transition Density ───
        trans = doc_feats.get('transition_word_ratio', 0.0)
        if trans > 0.035:
            trans_signal = 85.0
        elif trans > 0.018:
            trans_signal = 60.0
        elif trans > 0.005:
            trans_signal = 35.0
        else:
            trans_signal = 15.0

        # ─── Dimension D: Personal Narrative Voice vs Impersonal Register ───
        pronoun_1st = doc_feats.get('pronoun_1st_ratio', 0.0)
        entity_density = doc_feats.get('entity_density', 0.0)
        
        if pronoun_1st > 0.04:
            voice_signal = 10.0  # Strong autobiographical human voice
        elif pronoun_1st > 0.015:
            voice_signal = 20.0
        else:
            # Zero 1st person pronouns: check if it's factual encyclopedic writing vs abstract AI
            if entity_density > 0.05 and trans_signal <= 35.0:
                voice_signal = 25.0  # Factual / Encyclopedic / Historical human reference text
            else:
                voice_signal = 70.0  # Impersonal abstract text

        # ─── Dimension E: Syntactic Formality & Abstract Diction ───
        avg_word_len = doc_feats.get('avg_word_len', 4.5)
        flesch = doc_feats.get('flesch_reading_ease', 70.0)
        if avg_word_len > 6.2 and flesch < 35.0:
            syntax_signal = 80.0
        elif avg_word_len > 5.4:
            syntax_signal = 55.0
        elif avg_word_len < 4.8 and flesch > 70.0:
            syntax_signal = 15.0
        else:
            syntax_signal = 40.0

        # 3. Model Inference (if model file loaded)
        raw_classifier_prob = 50.0
        if self.model_loaded and self.classifier:
            active_feats = getattr(self, 'active_feature_names', FEATURE_NAMES)
            if self.scaler is not None:
                expected_n_features = getattr(self.scaler, 'n_features_in_', len(active_feats))
            else:
                expected_n_features = getattr(self.classifier, 'n_features_in_', len(active_feats))

            if len(active_feats) != expected_n_features:
                print(f"[WARNING] Feature dimension mismatch: model expects {expected_n_features} features, but {len(active_feats)} provided in vector. Falling back to heuristic mode.")
            else:
                try:
                    X_vec = np.array([[doc_feats[fn] for fn in active_feats]])
                    if self.scaler is not None:
                        X_input = self.scaler.transform(X_vec)
                    else:
                        X_input = X_vec

                    if hasattr(self.classifier, "predict_proba"):
                        probs = self.classifier.predict_proba(X_input)[0]
                        raw_classifier_prob = float(probs[1]) * 100.0 if len(probs) > 1 else float(probs[0]) * 100.0
                    else:
                        pred = self.classifier.predict(X_input)[0]
                        raw_classifier_prob = 80.0 if pred == 1 else 20.0
                except Exception as e:
                    print(f"[WARNING] Model inference failed: {e}. Falling back to heuristic mode.")

        # Composite AI Pattern Signal: Multi-Feature Weighted Fusion
        signals_list = [burst_signal, vocab_signal, trans_signal, voice_signal, syntax_signal]
        feature_avg_signal = (
            (burst_signal * 0.25) +
            (trans_signal * 0.25) +
            (voice_signal * 0.20) +
            (syntax_signal * 0.15) +
            (vocab_signal * 0.15)
        )

        if self.model_loaded:
            if feature_avg_signal < 25.0 or feature_avg_signal > 75.0:
                composite_ai_signal = (raw_classifier_prob * 0.20) + (feature_avg_signal * 0.80)
            else:
                composite_ai_signal = (raw_classifier_prob * 0.35) + (feature_avg_signal * 0.65)
        else:
            composite_ai_signal = feature_avg_signal

        # ─── Crucial Genre & Factual Reference Calibration ───
        # Factual reference text (like Wikipedia articles with dates & named entities, but NO AI transition connectors)
        # receives low AI pattern signal (Likely Human / Mostly Human).
        # Deliberately AI-generated historical essays contain elevated AI transitions ("Furthermore", "Consequently") and abstract syntax, so they are NOT capped.
        if entity_density > 0.05 and pronoun_1st == 0 and trans_signal <= 35.0:
            composite_ai_signal = min(24.0, composite_ai_signal)

        doc_ai_prob = float(max(3.0, min(97.0, composite_ai_signal)))
        authenticity_score = round(max(3.0, min(97.0, 100.0 - doc_ai_prob)), 1)
        doc_ai_prob_rounded = round(doc_ai_prob, 1)

        # 4. Decoupled Evidence Strength & Confidence Calculation
        # Length score (0-100)
        if word_count < 80:
            len_score = 30.0
        elif word_count < 160:
            len_score = 60.0
        elif word_count < 300:
            len_score = 80.0
        else:
            len_score = 95.0

        # Sentence count score (0-100)
        if num_sents < 4:
            sent_score = 30.0
        elif num_sents < 7:
            sent_score = 65.0
        else:
            sent_score = 90.0

        # Feature Agreement Score (measures if signals concur or contradict)
        signal_std = float(np.std(signals_list))
        if signal_std < 18.0:
            agreement_score = 90.0  # Consistent signals
        elif signal_std < 30.0:
            agreement_score = 65.0  # Moderately consistent
        else:
            agreement_score = 35.0  # Conflicting signals (e.g. mixed/encyclopedic)

        # Encyclopedic/factual text has inherent genre ambiguity
        if entity_density > 0.07 and pronoun_1st == 0:
            agreement_score = min(50.0, agreement_score)

        evidence_composite = (len_score * 0.35) + (sent_score * 0.25) + (agreement_score * 0.40)

        if evidence_composite >= 72.0:
            confidence_level = "high"
            evidence_strength = "Strong"
        elif evidence_composite >= 45.0:
            confidence_level = "medium"
            evidence_strength = "Moderate"
        else:
            confidence_level = "low"
            evidence_strength = "Limited"

        # 5. Evidence-Based Overall Classification
        if confidence_level == "low":
            if doc_ai_prob < 40.0:
                classification = "Mostly Human"
            else:
                classification = "Mixed / Uncertain"
        else:
            if doc_ai_prob < 30.0:
                classification = "Likely Human"
            elif doc_ai_prob < 48.0:
                classification = "Mostly Human"
            elif doc_ai_prob < 68.0:
                classification = "Mixed / Uncertain"
            else:
                # Require at least 3 elevated signals to classify as Likely AI-Assisted
                elevated_count = sum(1 for s in signals_list if s >= 60.0)
                if elevated_count >= 3 and confidence_level in ("medium", "high"):
                    classification = "Likely AI-Assisted"
                else:
                    classification = "Mixed / Uncertain"

        # 6. Paragraph Mapping
        paragraphs = [p.strip() for p in raw_text.split('\n\n') if p.strip()]
        sentence_para_map = []
        curr_para_idx = 0
        for s in sentences:
            if curr_para_idx < len(paragraphs) - 1:
                if s not in paragraphs[curr_para_idx]:
                    if s in paragraphs[curr_para_idx + 1]:
                        curr_para_idx += 1
            sentence_para_map.append(curr_para_idx)

        # 7. Sentence-Level Scoring (Multi-Signal Aggregation per sentence)
        sent_analyses: List[SentenceAnalysis] = []
        for idx, (s, sf) in enumerate(zip(sentences, sent_feats_list)):
            p_idx = sentence_para_map[idx] if idx < len(sentence_para_map) else 0

            s_words = self.feature_extractor.tokenize_words(s)
            s_word_cnt = len(s_words)
            s_predictability = sf.get('predictability_index', 0.3)
            s_trans_ratio = sf.get('transition_word_ratio', 0.0)
            s_pronoun_1st = sf.get('pronoun_1st_ratio', 0.0)
            s_passive = sf.get('passive_voice_indicator', 0.0)
            s_avg_word_len = sf.get('avg_word_length', 4.5)
            s_flesch = sf.get('flesch_reading_ease', 70.0)

            # Count capitalized words / numbers in this sentence
            s_cap_count = len([w for w in s_words if w.capitalize() == w and not w.islower()])
            s_num_count = len([w for w in s_words if any(c.isdigit() for c in w)])
            s_entity_density = (s_cap_count + s_num_count * 2.0) / float(max(1, s_word_cnt))

            # Base signal starts from document context (30% weight) + neutral base (15.0)
            s_signal = 15.0 + (doc_ai_prob * 0.30)

            # Elevated AI markers
            s_signal += s_predictability * 40.0
            s_signal += s_trans_ratio * 120.0
            s_signal += s_passive * 15.0

            if s_flesch < 35.0 and s_avg_word_len > 6.0:
                s_signal += 15.0

            # Authentic human markers
            if s_pronoun_1st > 0.04:
                s_signal -= min(40.0, s_pronoun_1st * 260.0)
            if s_flesch > 75.0 and s_avg_word_len < 4.8:
                s_signal -= 15.0

            # Factual / Encyclopedic damping
            if s_entity_density > 0.10 and s_pronoun_1st == 0:
                s_signal = min(48.0, s_signal)

            sent_ai_score = round(max(3.0, min(97.0, s_signal)), 1)

            # Calibrated sentence thresholds
            if sent_ai_score >= 58.0:
                sent_label = "ai"
            elif sent_ai_score >= 35.0:
                sent_label = "uncertain"
            else:
                sent_label = "human"

            s_confidence = "high" if (sent_ai_score > 75 or sent_ai_score < 25) else "medium"

            patterns, explanation, suggestion = self.explanation_engine.generate_sentence_explanation(
                s, sf, doc_feats, sent_ai_score
            )

            sent_analyses.append(SentenceAnalysis(
                id=f"s_{idx+1}",
                index=idx,
                text=s,
                label=sent_label,
                aiProbability=sent_ai_score,
                confidence=s_confidence,
                patterns=patterns,
                explanation=explanation,
                suggestion=suggestion if suggestion else None,
                paragraphIndex=p_idx
            ))

        # 8. Writing Metrics & Fingerprint (Normalized 0–100)
        vocab_div = min(100.0, max(0.0, doc_feats['ttr'] * 115.0))
        sent_var = min(100.0, max(0.0, doc_feats['burstiness'] * 140.0))
        sent_comp = min(100.0, max(0.0, (16.0 - doc_feats['gunning_fog']) * 6.0 + 40.0))
        readability_score = min(100.0, max(0.0, doc_feats['flesch_reading_ease']))
        grammar_score = 92.0
        passive_score = min(100.0, max(0.0, 100.0 - (doc_feats['passive_ratio'] * 200.0)))
        tone_score = min(100.0, max(0.0, doc_feats['pronoun_1st_ratio'] * 500.0 + 40.0))
        vocab_rich = min(100.0, max(0.0, 100.0 - (doc_feats['yules_k'] / 2.5)))
        consistency = min(100.0, max(0.0, 85.0 - (doc_feats['ngram_repetition_rate'] * 300.0)))

        metrics = WritingMetrics(
            vocabularyDiversity=round(vocab_div, 1),
            sentenceVariation=round(sent_var, 1),
            sentenceComplexity=round(sent_comp, 1),
            readability=round(readability_score, 1),
            grammar=round(grammar_score, 1),
            passiveVoice=round(passive_score, 1),
            emotionalTone=round(tone_score, 1),
            vocabularyRichness=round(vocab_rich, 1),
            writingConsistency=round(consistency, 1)
        )

        fingerprint = WritingFingerprint(
            vocabulary=round(vocab_div, 1),
            sentenceRhythm=round(sent_var, 1),
            complexity=round(sent_comp, 1),
            punctuation=round(min(100.0, max(20.0, (1.0 - doc_feats['ngram_repetition_rate']) * 90.0)), 1),
            formality=round(min(100.0, max(10.0, (doc_feats['avg_word_len'] - 3.5) * 28.0 + 30.0)), 1),
            uniqueness=round(min(100.0, max(10.0, doc_feats['ttr'] * 95.0)), 1)
        )

        # 9. Paragraph Risks
        para_risks: List[ParagraphRisk] = []
        for p_idx in range(len(paragraphs)):
            p_sents = [s for s in sent_analyses if s.paragraphIndex == p_idx]
            if p_sents:
                p_avg_prob = round(float(np.mean([s.aiProbability for s in p_sents])), 1)
                p_label = "Low Pattern Signal" if p_avg_prob < 35.0 else ("Medium Pattern Signal" if p_avg_prob < 60.0 else "Elevated Pattern Signal")
            else:
                p_avg_prob = doc_ai_prob_rounded
                p_label = "Low Pattern Signal"
            para_risks.append(ParagraphRisk(
                paragraphIndex=p_idx,
                label=p_label,
                aiProbability=p_avg_prob
            ))

        # 10. Improvements & Feedback
        improvements: List[Improvement] = []
        imp_idx = 1
        if doc_feats['burstiness'] < 0.20:
            improvements.append(Improvement(
                id=f"imp_{imp_idx}",
                category="sentence-structure",
                issue="Uniform sentence pacing across paragraphs",
                suggestion="Mix short, punchy statements with longer descriptive sentences to create a more dynamic, natural human rhythm.",
                severity="medium"
            ))
            imp_idx += 1

        if doc_feats['transition_word_ratio'] > 0.025:
            improvements.append(Improvement(
                id=f"imp_{imp_idx}",
                category="vocabulary",
                issue="Elevated formal transitional connectors",
                suggestion="Reduce reliance on academic transition words ('furthermore', 'moreover') in favor of natural narrative transitions.",
                severity="medium"
            ))
            imp_idx += 1

        if doc_feats['pronoun_1st_ratio'] < 0.015 and entity_density < 0.07:
            improvements.append(Improvement(
                id=f"imp_{imp_idx}",
                category="authenticity",
                issue="Low personal autobiographical voice",
                suggestion="Admissions essays benefit from direct first-person reflection ('I learned', 'I realized') to showcase personal growth.",
                severity="low"
            ))
            imp_idx += 1

        if not improvements:
            improvements.append(Improvement(
                id="imp_1",
                category="authenticity",
                issue="Strong overall stylistic authenticity",
                suggestion="Your essay demonstrates organic sentence flow and authentic voice. Continue polishing for narrative clarity.",
                severity="low"
            ))

        # 11. Dynamic Explanations & Limitations
        flagged_count = sum(1 for s in sent_analyses if s.label == 'ai')
        summary, why_this, genre_obs, limitations = self.explanation_engine.generate_essay_summary(
            classification, confidence_level, doc_ai_prob_rounded,
            flagged_count, num_sents, doc_feats
        )

        writing_quality = round((metrics.readability * 0.4) + (metrics.sentenceVariation * 0.3) + (metrics.vocabularyDiversity * 0.3), 1)
        originality = round((metrics.vocabularyRichness * 0.5) + (fingerprint.uniqueness * 0.5), 1)

        return EssayAnalysisResponse(
            essayId=essay_id,
            authenticityScore=authenticity_score,
            aiProbability=doc_ai_prob_rounded,
            confidence=confidence_level,
            evidenceStrength=evidence_strength,
            classification=classification,
            writingQuality=writing_quality,
            originality=originality,
            sentences=sent_analyses,
            metrics=metrics,
            fingerprint=fingerprint,
            paragraphRisks=para_risks,
            improvements=improvements,
            analyzedAt=now_iso,
            summary=summary,
            whyThisResult=why_this,
            genreObservation=genre_obs,
            signals={
                "word_count": word_count,
                "sentence_count": num_sents,
                "burstiness": round(doc_feats['burstiness'], 3),
                "ttr": round(doc_feats['ttr'], 3),
                "transition_ratio": round(doc_feats['transition_word_ratio'], 3),
                "pronoun_1st_ratio": round(doc_feats['pronoun_1st_ratio'], 3),
                "entity_density": round(doc_feats['entity_density'], 3),
                "flesch_reading_ease": round(doc_feats['flesch_reading_ease'], 1)
            },
            limitations=limitations,
            reliability_notice="Detection is probabilistic and should not be treated as proof of AI authorship."
        )

    def compare_essays(self, text_a: str, text_b: str, title_a: str = "Essay A", title_b: str = "Essay B") -> EssayCompareResponse:
        res_a = self.analyze_essay(text_a, essay_id="ess_comp_a")
        res_b = self.analyze_essay(text_b, essay_id="ess_comp_b")

        words_a = set(self.feature_extractor.tokenize_words(text_a))
        words_b = set(self.feature_extractor.tokenize_words(text_b))

        intersection = len(words_a.intersection(words_b))
        union = len(words_a.union(words_b))
        jaccard_sim = (intersection / float(max(1, union))) * 100.0

        vocab_sim = round(max(10.0, min(98.0, 100.0 - abs(res_a.metrics.vocabularyDiversity - res_b.metrics.vocabularyDiversity) * 1.1 + jaccard_sim * 0.35)), 1)
        style_sim = round(max(10.0, min(98.0, 100.0 - abs(res_a.metrics.sentenceVariation - res_b.metrics.sentenceVariation) * 1.4)), 1)
        cons_sim = round(max(10.0, min(98.0, 100.0 - abs(res_a.metrics.writingConsistency - res_b.metrics.writingConsistency) * 1.2)), 1)
        overall_sim = round((vocab_sim * 0.35) + (style_sim * 0.35) + (cons_sim * 0.30), 1)

        radar_comp = [
            CompareSubjectScore(subject="Vocabulary", A=res_a.metrics.vocabularyDiversity, B=res_b.metrics.vocabularyDiversity),
            CompareSubjectScore(subject="Sentence Style", A=res_a.metrics.sentenceVariation, B=res_b.metrics.sentenceVariation),
            CompareSubjectScore(subject="Consistency", A=res_a.metrics.writingConsistency, B=res_b.metrics.writingConsistency),
            CompareSubjectScore(subject="Authenticity", A=res_a.authenticityScore, B=res_b.authenticityScore),
            CompareSubjectScore(subject="Originality", A=res_a.originality, B=res_b.originality)
        ]

        sim_metrics = [
            CompareSimilarityMetric(label="Vocabulary Similarity", a=res_a.metrics.vocabularyDiversity, b=res_b.metrics.vocabularyDiversity, result=vocab_sim, description="Lexical overlap and word choice distribution."),
            CompareSimilarityMetric(label="Sentence Style", a=res_a.metrics.sentenceVariation, b=res_b.metrics.sentenceVariation, result=style_sim, description="Sentence length rhythm and burstiness alignment."),
            CompareSimilarityMetric(label="Writing Consistency", a=res_a.metrics.writingConsistency, b=res_b.metrics.writingConsistency, result=cons_sim, description="Structural cadence across paragraphs."),
            CompareSimilarityMetric(label="Overall Similarity", a=res_a.authenticityScore, b=res_b.authenticityScore, result=overall_sim, description="Composite stylometric match score.")
        ]

        if overall_sim > 75.0:
            obs = "High stylistic continuity: both texts share closely aligned vocabulary range, sentence rhythms, and structural pacing."
        elif overall_sim > 50.0:
            obs = "Moderate stylistic alignment: some shared vocabulary and cadence, with noticeable differences in sentence variety."
        else:
            obs = "Significant stylistic divergence: the essays exhibit distinctly different voice, sentence length pacing, and vocabulary distributions."

        return EssayCompareResponse(
            essayA=res_a,
            essayB=res_b,
            titleA=title_a,
            titleB=title_b,
            vocabularySimilarity=vocab_sim,
            sentenceStyleSimilarity=style_sim,
            writingConsistencySimilarity=cons_sim,
            overallSimilarity=overall_sim,
            similarityMetrics=sim_metrics,
            radarComparison=radar_comp,
            stylisticShiftObservation=obs
        )
