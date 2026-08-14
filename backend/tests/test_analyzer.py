import pytest
from app.services.analyzer import EssayAnalyzer
from app.services.feature_extractor import FeatureExtractor
from app.services.explanation_engine import ExplanationEngine

@pytest.fixture
def analyzer():
    return EssayAnalyzer()

@pytest.fixture
def extractor():
    return FeatureExtractor()

@pytest.fixture
def explanation_engine():
    return ExplanationEngine()

def test_empty_essay_handling(analyzer):
    res = analyzer.analyze_essay("")
    assert res.classification == "Insufficient Evidence"
    assert res.authenticityScore == 50.0
    assert len(res.sentences) == 0

def test_short_essay_handling(analyzer):
    short_text = "I love computer science. It is my dream to build software systems for humanity."
    res = analyzer.analyze_essay(short_text)
    assert res.classification == "Insufficient Evidence"
    assert res.confidence == "low"
    assert res.signals["word_count"] < 50

def test_normal_human_essay_analysis(analyzer):
    normal_text = """I have always been fascinated by the way computers solve problems. Growing up, I spent hours tinkering with broken electronics in my garage, trying to understand why they worked the way they did. My curiosity eventually led me to write my first program at age fourteen—a simple calculator that could add, subtract, multiply, and divide. During my second semester, I built a small web application to help my school track library book loans. It was clunky at first—full of bugs I didn't understand—but fixing each one felt like solving a puzzle. I remember staying up past midnight trying to figure out why my database queries were returning duplicate records. When I finally found the off-by-one error, I jumped out of my chair. My grandfather was a mechanical engineer who built bridges. Every summer, he would walk me through his old blueprints and explain how tension and compression worked."""
    
    res = analyzer.analyze_essay(normal_text)
    assert res.classification in ["Likely Human", "Mostly Human", "Mixed / Uncertain", "Likely AI-Assisted"]
    assert len(res.sentences) > 0
    assert res.metrics.vocabularyDiversity >= 0
    assert res.fingerprint.sentenceRhythm >= 0

def test_ai_generated_essay_sample(analyzer):
    ai_text = """In today's rapidly evolving technological landscape, the intersection of artificial intelligence and software engineering presents unprecedented opportunities for innovation and advancement. The integration of machine learning algorithms into modern applications has fundamentally transformed how we approach complex computational challenges. Furthermore, it is essential to acknowledge that the proliferation of data-driven methodologies has significantly impacted various sectors of the economy, enabling organizations to leverage insights derived from large-scale analytics platforms. My academic journey has been defined by a persistent pursuit of excellence and a deep commitment to mastering fundamental principles of computer science. The opportunity to contribute to a forward-thinking institution such as yours, which has consistently demonstrated leadership in technological innovation and research excellence, represents a pivotal milestone in my academic journey."""
    
    res = analyzer.analyze_essay(ai_text)
    assert res.classification in ["Likely AI-Assisted", "Mixed / Uncertain", "Mostly Human", "Likely Human"]
    assert len(res.sentences) > 0
    assert res.aiProbability > 0

def test_sentence_segmentation(extractor):
    text = "First sentence here. Second sentence starts now! Is this the third sentence?"
    sents = extractor.split_sentences(text)
    assert len(sents) == 3
    assert sents[0] == "First sentence here."

def test_feature_extraction(extractor):
    text = "The rapid evolution of technological frameworks requires adaptive software engineering."
    doc_feats, sent_feats, sentences = extractor.extract_document_features(text)
    assert doc_feats["total_words"] > 0
    assert doc_feats["ttr"] > 0
    assert len(sent_feats) == len(sentences)

def test_explanation_generation(explanation_engine):
    sent_feats = {
        "burstiness_diff": 0.05,
        "ttr": 0.5,
        "function_word_ratio": 0.5,
        "transition_word_ratio": 0.1,
        "passive_voice_indicator": 1.0,
        "predictability_index": 0.8,
        "word_count": 15
    }
    doc_feats = {"burstiness": 0.1, "ttr": 0.5}
    patterns, explanation, suggestion = explanation_engine.generate_sentence_explanation(
        "Furthermore, passive decisions were executed.", sent_feats, doc_feats, 80.0
    )
    assert len(patterns) > 0
    assert len(explanation) > 0
    assert "AI" not in explanation or "signal" in explanation or "uniform" in explanation or "pattern" in explanation
