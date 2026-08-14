import re
import math
import numpy as np
from typing import Dict, List, Any, Tuple

# Fallback lists of function words, transition words, pronouns
FUNCTION_WORDS = {
    'the', 'a', 'an', 'in', 'on', 'at', 'by', 'for', 'with', 'about', 'against',
    'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'to', 'from', 'up', 'upon', 'down', 'in', 'out', 'off', 'over', 'under',
    'and', 'but', 'or', 'nor', 'so', 'yet', 'for', 'both', 'either', 'neither',
    'not', 'only', 'also', 'furthermore', 'moreover', 'however', 'therefore'
}

PRONOUNS_1ST_PERSON = {'i', 'me', 'my', 'mine', 'myself', 'we', 'us', 'our', 'ours', 'ourselves'}
PRONOUNS_3RD_PERSON = {'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves'}

TRANSITION_WORDS = {
    'furthermore', 'moreover', 'however', 'therefore', 'consequently',
    'nevertheless', 'nonetheless', 'additionally', 'meanwhile', 'subsequently',
    'accordingly', 'conversely', 'further', 'thus', 'hence'
}

PASSIVE_AUXILIARIES = {'be', 'am', 'is', 'are', 'was', 'were', 'been', 'being', 'get', 'gets', 'got', 'getting'}

class FeatureExtractor:
    def __init__(self, spacy_nlp=None):
        self.nlp = spacy_nlp

    def tokenize_words(self, text: str) -> List[str]:
        return re.findall(r'\b[a-zA-Z0-9\'-]+\b', text.lower())

    def split_sentences(self, text: str) -> List[str]:
        if self.nlp:
            doc = self.nlp(text)
            sents = [s.text.strip() for s in doc.sents if s.text.strip()]
            if sents:
                return sents
        # Fallback regex segmentation
        raw_sents = re.split(r'(?<=[.!?])\s+', text)
        return [s.strip() for s in raw_sents if s.strip()]

    def count_syllables(self, word: str) -> int:
        word = word.lower()
        if len(word) <= 3:
            return 1
        word = re.sub(r'(?:[^laeiouy]es|ed|[^laeiouy]e)$', '', word)
        word = re.sub(r'^y', '', word)
        syllables = len(re.findall(r'[aeiouy]{1,2}', word))
        return max(1, syllables)

    def extract_sentence_features(self, sentence: str, doc_baseline: Dict[str, float] = None) -> Dict[str, float]:
        words = self.tokenize_words(sentence)
        num_words = len(words)
        if num_words == 0:
            return {
                'length_chars': 0, 'word_count': 0, 'avg_word_length': 0,
                'ttr': 0, 'syllables_per_word': 0, 'flesch_reading_ease': 0,
                'function_word_ratio': 0, 'pronoun_1st_ratio': 0, 'transition_word_ratio': 0,
                'passive_voice_indicator': 0, 'punctuation_density': 0, 'pos_entropy': 0,
                'predictability_index': 0, 'burstiness_diff': 0
            }

        length_chars = len(sentence)
        avg_word_len = sum(len(w) for w in words) / num_words
        unique_words = set(words)
        ttr = len(unique_words) / num_words

        syllables = sum(self.count_syllables(w) for w in words)
        syllables_per_word = syllables / num_words

        # Readability Flesch Reading Ease estimate for sentence
        # 206.835 - 1.015 * (words/1) - 84.6 * (syllables/words)
        flesch_ease = 206.835 - (1.015 * num_words) - (84.6 * syllables_per_word)
        flesch_ease = max(0.0, min(100.0, flesch_ease))

        # Function words & pronouns
        func_count = sum(1 for w in words if w in FUNCTION_WORDS)
        pron_1st_count = sum(1 for w in words if w in PRONOUNS_1ST_PERSON)
        trans_count = sum(1 for w in words if w in TRANSITION_WORDS)

        function_word_ratio = func_count / num_words
        pronoun_1st_ratio = pron_1st_count / num_words
        transition_word_ratio = trans_count / num_words

        # Passive voice indicator heuristics
        passive_indicator = 0.0
        if self.nlp:
            doc = self.nlp(sentence)
            for token in doc:
                if token.dep_ == 'auxpass' or (token.tag_ in ('VBN', 'VBD') and any(child.lemma_ in PASSIVE_AUXILIARIES for child in token.head.children if child.dep_ in ('aux', 'auxpass'))):
                    passive_indicator = 1.0
                    break
        else:
            # Fallback regex pattern for passive voice: auxiliary + past participle heuristic
            if re.search(r'\b(am|is|are|was|were|been|being|be)\b\s+(\w+ed|\w+en)\b', sentence, re.IGNORECASE):
                passive_indicator = 1.0

        # Punctuation density
        punct_count = len(re.findall(r'[,;:!\?"\'\(\)\-]', sentence))
        punctuation_density = punct_count / max(1, length_chars)

        # Syntactic POS entropy & structure predictability
        pos_entropy = 0.5
        if self.nlp:
            doc = self.nlp(sentence)
            pos_tags = [token.pos_ for token in doc]
            if pos_tags:
                tag_counts = {}
                for tag in pos_tags:
                    tag_counts[tag] = tag_counts.get(tag, 0) + 1
                total = len(pos_tags)
                pos_entropy = -sum((c / total) * math.log2(c / total) for c in tag_counts.values())

        # Predictability index (syntactic and lexical formality weight: 0.0 to 1.0)
        burstiness_diff = 0.0
        if doc_baseline:
            avg_doc_len = doc_baseline.get('avg_sent_len', 15.0)
            burstiness_diff = abs(num_words - avg_doc_len) / max(1.0, avg_doc_len)

        avg_word_factor = max(0.0, min(1.0, (avg_word_len - 4.2) / 3.0))
        syllable_factor = max(0.0, min(1.0, (syllables_per_word - 1.3) / 1.0))
        predictability_index = (avg_word_factor * 0.45) + (syllable_factor * 0.35) + (min(1.0, transition_word_ratio * 10.0) * 0.20)
        predictability_index = float(max(0.0, min(1.0, predictability_index)))

        return {
            'length_chars': float(length_chars),
            'word_count': float(num_words),
            'avg_word_length': float(avg_word_len),
            'ttr': float(ttr),
            'syllables_per_word': float(syllables_per_word),
            'flesch_reading_ease': float(flesch_ease),
            'function_word_ratio': float(function_word_ratio),
            'pronoun_1st_ratio': float(pronoun_1st_ratio),
            'transition_word_ratio': float(transition_word_ratio),
            'passive_voice_indicator': float(passive_indicator),
            'punctuation_density': float(punctuation_density),
            'pos_entropy': float(pos_entropy),
            'predictability_index': float(predictability_index),
            'burstiness_diff': float(burstiness_diff)
        }

    def extract_document_features(self, text: str) -> Tuple[Dict[str, float], List[Dict[str, float]], List[str]]:
        sentences = self.split_sentences(text)
        words = self.tokenize_words(text)
        num_words = len(words)
        num_sents = len(sentences)

        if num_words == 0 or num_sents == 0:
            doc_feats = {
                'total_words': 0.0, 'total_sentences': 0.0, 'avg_sent_len': 0.0,
                'sent_len_std': 0.0, 'burstiness': 0.0, 'ttr': 0.0, 'yules_k': 0.0,
                'avg_word_len': 0.0, 'function_word_ratio': 0.0, 'pronoun_1st_ratio': 0.0,
                'transition_word_ratio': 0.0, 'passive_ratio': 0.0, 'flesch_reading_ease': 0.0,
                'gunning_fog': 0.0, 'ngram_repetition_rate': 0.0, 'para_len_var': 0.0
            }
            return doc_feats, [], sentences

        sent_lengths = [len(self.tokenize_words(s)) for s in sentences]
        avg_sent_len = float(np.mean(sent_lengths))
        sent_len_std = float(np.std(sent_lengths))
        burstiness = sent_len_std / max(1.0, avg_sent_len)

        # Type-Token Ratio (TTR) & Yule's K
        unique_words = set(words)
        ttr = len(unique_words) / num_words

        word_counts = {}
        for w in words:
            word_counts[w] = word_counts.get(w, 0) + 1

        # Yule's K calculation: K = 10^4 * (sum(f_i * i^2) - N) / N^2
        freq_spectrum = {}
        for count in word_counts.values():
            freq_spectrum[count] = freq_spectrum.get(count, 0) + 1
        
        sum_fi_i2 = sum(freq * (i ** 2) for i, freq in freq_spectrum.items())
        yules_k = 10000.0 * (sum_fi_i2 - num_words) / float(max(1, num_words ** 2))

        avg_word_len = sum(len(w) for w in words) / float(num_words)

        func_words = sum(1 for w in words if w in FUNCTION_WORDS)
        pron_1st = sum(1 for w in words if w in PRONOUNS_1ST_PERSON)
        trans_words = sum(1 for w in words if w in TRANSITION_WORDS)

        function_word_ratio = func_words / float(num_words)
        pronoun_1st_ratio = pron_1st / float(num_words)
        transition_word_ratio = trans_words / float(num_words)

        # Sentence-level features array
        doc_baseline = {'avg_sent_len': avg_sent_len, 'sent_len_std': sent_len_std}
        sent_features = [self.extract_sentence_features(s, doc_baseline) for s in sentences]

        passive_count = sum(1 for sf in sent_features if sf['passive_voice_indicator'] > 0.5)
        passive_ratio = passive_count / float(num_sents)

        # Readability metrics for document
        complex_words = sum(1 for w in words if self.count_syllables(w) >= 3)
        complex_word_ratio = complex_words / float(num_words)

        total_syllables = sum(self.count_syllables(w) for w in words)
        syllables_per_word = total_syllables / float(num_words)

        flesch_reading_ease = 206.835 - (1.015 * (num_words / float(num_sents))) - (84.6 * syllables_per_word)
        flesch_reading_ease = float(max(0.0, min(100.0, flesch_reading_ease)))

        gunning_fog = 0.4 * ((num_words / float(num_sents)) + (100.0 * complex_word_ratio))
        gunning_fog = float(gunning_fog)

        # 3-gram repetition rate
        trigrams = [tuple(words[i:i+3]) for i in range(len(words)-2)]
        trigram_counts = {}
        for tg in trigrams:
            trigram_counts[tg] = trigram_counts.get(tg, 0) + 1
        repeated_trigrams = sum(c - 1 for c in trigram_counts.values() if c > 1)
        ngram_repetition_rate = repeated_trigrams / float(max(1, len(trigrams)))

        # Paragraph length variation
        paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
        para_lens = [len(self.tokenize_words(p)) for p in paragraphs]
        para_len_var = float(np.var(para_lens)) if len(para_lens) > 1 else 0.0

        # Specific named entities and numerical factual density (Wikipedia/encyclopedic human signal)
        capitalized_words = len(re.findall(r'\b[A-Z][a-z0-9]+\b', text))
        numbers_count = len(re.findall(r'\b\d{1,4}(?:st|nd|rd|th)?\b', text))
        entity_density = float((capitalized_words + (numbers_count * 2.0)) / float(max(1, num_words)))

        doc_feats = {
            'total_words': float(num_words),
            'total_sentences': float(num_sents),
            'avg_sent_len': float(avg_sent_len),
            'sent_len_std': float(sent_len_std),
            'burstiness': float(burstiness),
            'ttr': float(ttr),
            'yules_k': float(yules_k),
            'avg_word_len': float(avg_word_len),
            'function_word_ratio': float(function_word_ratio),
            'pronoun_1st_ratio': float(pronoun_1st_ratio),
            'transition_word_ratio': float(transition_word_ratio),
            'passive_ratio': float(passive_ratio),
            'flesch_reading_ease': float(flesch_reading_ease),
            'gunning_fog': float(gunning_fog),
            'ngram_repetition_rate': float(ngram_repetition_rate),
            'para_len_var': float(para_len_var),
            'entity_density': float(entity_density)
        }

        return doc_feats, sent_features, sentences
