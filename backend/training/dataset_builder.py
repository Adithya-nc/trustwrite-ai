import os
import pandas as pd
from typing import Tuple, List, Dict

SAMPLE_HUMAN_ESSAYS = [
    # 1. CS & garage tinkering
    """I have always been fascinated by the way computers solve problems. Growing up, I spent hours tinkering with broken electronics in my garage, trying to understand why they worked the way they did. My curiosity eventually led me to write my first program at age fourteen—a simple calculator that could add, subtract, multiply, and divide. During my second semester, I built a small web application to help my school track library book loans. It was clunky at first—full of bugs I didn't understand—but fixing each one felt like solving a puzzle. I remember staying up past midnight trying to figure out why my database queries were returning duplicate records. When I finally found the off-by-one error, I jumped out of my chair. My grandfather was a mechanical engineer who built bridges. Every summer, he would walk me through his old blueprints and explain how tension and compression worked. I didn't fully understand the math then, but I understood that he was solving a problem that mattered—that people would cross his bridges safely. That's what I want to do with software.""",
    
    # 2. Orchestra & immigration
    """Moving to America at age twelve was the hardest thing I had ever done. I didn't speak English, and my first day of middle school in Ohio felt terrifying. Kids would ask me questions, and I would just nod nervously, hoping I wasn't agreeing to something embarrassing. But music became my universal language. I had played the cello since I was six, and joining the school orchestra gave me a place where I didn't need words to fit in. Sitting in the third chair section, reading sheet music with students from completely different backgrounds, I realized that harmony comes from blending different voices together. In high school, I organized a community concert series that raised funds for local immigrant family services. We performed everything from Bach suites to traditional folk melodies. Managing rehearsals and coordinating venue logistics forced me out of my comfort zone. I learned to speak up, to negotiate, and to lead with empathy.""",
    
    # 3. Family restaurant
    """The kitchen in my family's small restaurant was my first classroom. My father opened 'El Sol' three years after arriving in Texas, working 16-hour days to keep the doors open. From wiping down tables at age nine to managing inventory by sophomore year, I watched how grit and dedication transformed a struggling diner into a neighborhood institution. One evening during peak dinner rush, our main point-of-sale terminal crashed, threatening to derail the night. While my dad calmed frustrated customers, I quickly set up a manual paper ticket system and calculated totals using my phone's spreadsheet app. We survived the night without missing an order. That crisis sparked my interest in business operations and financial strategy. I began reading economics textbooks and analyzing our monthly expenses, suggesting small menu modifications that cut food waste by 12%.""",

    # 4. Diabetes clinic volunteering
    """When I was fifteen, my younger sister was diagnosed with type 1 diabetes. Overnight, our daily routine changed completely—finger pricks, carbohydrate counting, and blood glucose logs became second nature. Watching her navigate the fear and anxiety of a chronic illness opened my eyes to the human side of medicine. I started volunteering at the local pediatric endocrinology clinic every Saturday morning. My job was simple: greeting patients, sterilizing equipment, and keeping young kids distracted with drawing books while doctors administered treatments. But the real lesson was in observing how compassionate communication could ease a child's terror. One seven-year-old patient named Leo refused to let the nurse administer an insulin injection until I sat beside him and drew a superhero mask on his bandage. Science provides the tools to heal the body, but empathy gives patients the strength to endure.""",

    # 5. Environmental sensors in Detroit
    """My passion for environmental policy began in my own backyard—literally. Living adjacent to an industrial district in Detroit, I noticed how air quality alerts frequently cancelled our outdoor gym classes while suburban schools twenty miles away played outside freely. Determined to understand the disparity, I partnered with a local university lab to install low-cost particulate matter sensors across five neighborhoods. Collecting data over six months, I drafted a comprehensive 15-page report highlighting localized pollution hotspots. Presenting our findings to the city council was nerve-wracking, but seeing our data cited in a new municipal zoning proposal was electrifying. Environmental justice is not just an abstract academic topic to me; it is a lived reality for thousands of families.""",

    # 6. High school robotics team
    """Our robotics team had three weeks left before the regional championship when our primary drive motor burned out. As team captain, I watched our members freeze in panic. We didn't have the budget to expedite a new part from Germany. Instead of giving up, I gathered the mechanical crew and proposed cannibalizing components from our previous year's prototype. We spent forty-eight hours machining custom aluminum brackets in our high school workshop. When our robot drove onto the competition field and successfully scored the winning autonomous goal, the entire gymnasium erupted in cheers. That season taught me that resourcefulness and collective trust matter far more than having the most expensive equipment.""",

    # 7. Local history archival
    """In the basement of our county courthouse, I discovered three dusty cardboard boxes filled with handwritten letters from local factory workers dating back to the 1920s. As a junior volunteer for the historical society, my task was merely to catalog the dates. But as I read through their stories of labor strikes, family struggles, and small community victories, I became obsessed with preserving their voices. I spent my entire summer digitizing over 400 pages of correspondence, transcribing brittle ink, and creating a searchable digital archive for local schools. History is not just a collection of dates in a textbook; it is the lived heartbeat of ordinary people whose sacrifices built the towns we live in today.""",

    # 8. Competitive debate
    """The timer read thirty seconds when the judge signaled for my final rebuttal. My hands were shaking, but my mind was clear. For three years, competitive policy debate was my obsession. We debated healthcare access, economic inequality, and constitutional law. In the beginning, I lost nearly every round because I spoke too fast and relied heavily on jargon. My debate coach pulled me aside and gave me the best advice I ever received: 'Stop trying to sound smart, and start trying to be understood.' I completely rebuilt my speaking style, focusing on storytelling and human impact rather than rapid-fire statistics. Winning the state tournament senior year was rewarding, but learning how to listen to opposing viewpoints with genuine respect was the true victory.""",

    # 9. Wildlife rehabilitation
    """Holding a wounded red-tailed hawk requires absolute stillness. As a volunteer at the regional wildlife center, I quickly learned that wild animals can sense human anxiety. My mentor taught me how to handle raptors gently without triggering their defense instincts. Feeding orphaned owls with tweezers and cleaning raptor enclosures before sunrise taught me discipline and quiet humility. One afternoon, we released a rehabilitated peregrine falcon back into the Appalachian foothills. Watching him take flight and soar above the mountain ridge gave me chills. That moment cemented my determination to dedicate my life to conservation biology and ecosystem preservation.""",

    # 10. Cooking & cultural heritage
    """Every Sunday morning, my grandmother would wake me up at 6 AM to make tamales. Rolling the masa dough to the exact thickness was an art form that took me years to master. In our household, the kitchen was not just for cooking; it was the sacred space where family stories, ancestral traditions, and historical wisdom were passed down across generations. When my grandmother was hospitalized last winter, our family was devastated. I stepped up to host the holiday dinner myself, preparing thirty pounds of tamales using her exact handwritten recipes. Seeing the smiles and tears of joy on my parents' faces made me realize that preserving our cultural heritage is an act of deep love and resilience.""",

    # 11. Community journalism
    """When our school board proposed cutting the arts program, I picked up my camera and voice recorder. As editor of the student paper, I spent three weeks interviewing music teachers, student painters, and parents. We published a 12-page special edition detailing how art programs improved graduation rates. Two weeks later, the board voted to keep the funding. That experience showed me the power of targeted investigative journalism.""",

    # 12. Mathematics tutoring
    """Explaining calculus to a struggling sophomore taught me more about mathematics than any textbook ever could. Maya was convinced she was 'bad at math.' I broke down derivatives into tangible velocity analogies—comparing slope to the speedometer on her bicycle. When she scored an A on her midterm, her confidence transformed completely. Teaching showed me that true mastery is about building bridges of understanding.""",

    # 13. Theater stage management
    """Behind the velvet curtain of our high school auditorium, chaos reigned during opening night of The Crucible. A lead actor lost his prop dagger three minutes before scene four. As stage manager, I calmly grabbed a spare wooden prop from our prop chest, painted it with quick-dry silver, and handed it to him just as he stepped on stage. Managing twenty crew members in dark wings taught me composure under immense pressure.""",

    # 14. Cross country running
    """Running five miles at 5:30 AM in freezing November rain sounds miserable to most people, but to me it was sanctuary. As co-captain of our varsity cross country team, I learned that endurance isn't about natural talent—it's about showing up when your legs ache and your lungs burn. Crossing the finish line at state finals was satisfying, but the real growth happened in the lonely early morning training miles.""",

    # 15. Hospital triage volunteer
    """In the busy emergency room waiting area, tension is palpable. My role as a weekend triage volunteer was to keep families informed and comfortable. I held the hand of an anxious father whose daughter was in surgery, bringing him warm tea and listening to him talk about her passion for soccer. Medicine is deeply scientific, but human connection is what sustains families in crisis.""",

    # 16. High school astronomy club
    """Building a 10-inch Newtonian reflector telescope from scratch took nine months of tedious glass grinding. Every evening in my garage, I polished the glass mirror by hand, testing the focal curve with a Foucault tester. The night we pointed our handmade scope at Saturn and saw its crisp golden rings for the first time, our entire astronomy club cheered in awe. Patience creates clarity.""",

    # 17. Local food bank logistics
    """Sorting 5,000 pounds of donated canned goods every Saturday taught me that hunger is a logistical challenge as much as an economic one. I noticed our food bank frequently ran out of fresh produce while excess bakery items expired. I built a simple Excel inventory tracking tool to match local grocery store surplus schedules with our distribution days, reducing food waste by 18%.""",

    # 18. Ceramics & pottery
    """Centering a five-pound lump of clay on a spinning potter's wheel requires physical balance and complete mental presence. Push too hard, and the clay collapses into a muddy lump; pull too fast, and the walls tear. Ceramics taught me to embrace failure as part of the process. Throwing hundreds of lopsided bowls until I crafted a symmetrical vase taught me patience and tactile precision.""",

    # 19. Philosophy & ethics debate
    """During our state ethics bowl, we tackled the complex dilemmas of autonomous vehicle decision-making and algorithmic accountability. Preparing our arguments required scrutinizing Kantian ethics alongside utilitarian frameworks. Standing before a panel of law professors and defending our position taught me to articulate nuanced moral reasoning under rigorous questioning.""",

    # 20. Immigrant family translator
    """From translating utility bills at the kitchen table to interpreting doctor appointments for my parents, being the eldest child of immigrant parents meant growing up quickly. Navigating two languages and cultures gave me a deep appreciation for nuance, active listening, and structural equity in public services."""
]

SAMPLE_AI_ESSAYS = [
    # 1. Tech & AI
    """In today's rapidly evolving technological landscape, the intersection of artificial intelligence and software engineering presents unprecedented opportunities for innovation and advancement. The integration of machine learning algorithms into modern applications has fundamentally transformed how we approach complex computational challenges. Furthermore, it is essential to acknowledge that the proliferation of data-driven methodologies has significantly impacted various sectors of the economy, enabling organizations to leverage insights derived from large-scale analytics platforms. My academic journey has been defined by a persistent pursuit of excellence and a deep commitment to mastering fundamental principles of computer science. The opportunity to contribute to a forward-thinking institution such as yours, which has consistently demonstrated leadership in technological innovation and research excellence, represents a pivotal milestone in my academic journey.""",

    # 2. International relations
    """In an era characterized by global interconnectivity and rapid geopolitical transformation, the study of international relations serves as a vital framework for addressing multifaceted global challenges. Throughout my academic career, I have consistently sought to understand the complex dynamics that govern international diplomacy, economic integration, and cross-cultural communication. Moreover, the implementation of sustainable policy frameworks requires a nuanced comprehension of historical contexts and institutional structures. Participating in diverse academic initiatives has enabled me to develop strong analytical capabilities and a comprehensive understanding of global governance. It is evident that effective leadership demands both strategic vision and collaborative problem-solving skills.""",

    # 3. Finance & economics
    """The realm of modern finance and enterprise management undergoes continuous transformation driven by technological innovation and market dynamics. In this context, strategic financial management plays a crucial role in enhancing organizational efficiency and fostering long-term economic growth. Furthermore, leveraging quantitative analytics and empirical models allows decision-makers to optimize resource allocation and mitigate financial risks effectively. Throughout my academic pursuits, I have dedicated myself to mastering core economic theories and analytical methodologies. The prospective opportunity to pursue advanced studies at your institution represents a vital step toward achieving my professional aspirations.""",

    # 4. Medicine & biomedical
    """Advances in biomedical science and healthcare delivery have revolutionized our approach to disease prevention and patient care. The synthesis of empirical research and clinical practice serves as the cornerstone of contemporary medical innovation. Additionally, the integration of multi-omics data and personalized medicine frameworks offers unprecedented potential to improve patient outcomes across diverse demographic groups. My commitment to pursuing a career in healthcare stems from a profound dedication to scientific inquiry and human well-being. Engaging in academic research and clinical observation has reinforced my passion for biomedical innovation.""",

    # 5. Sustainability
    """Environmental sustainability and resource management constitute some of the most pressing imperatives of the twenty-first century. Addressing complex ecological challenges requires an interdisciplinary approach that combines empirical environmental monitoring, public policy formulation, and innovative engineering solutions. Furthermore, the deployment of renewable energy technologies and sustainable urban planning frameworks plays a fundamental role in mitigating climate change impacts. Throughout my educational experience, I have striven to analyze environmental dynamics through a rigorous scientific lens.""",

    # 6. Education & pedagogy
    """The evolution of contemporary pedagogical frameworks necessitates a comprehensive reexamination of traditional educational paradigms. In a digital society, the implementation of personalized learning environments facilitates greater cognitive engagement and knowledge retention among diverse student cohorts. Furthermore, empirical research in educational psychology underscores the importance of fostering critical thinking and adaptive problem-solving skills. My overarching aspiration is to contribute substantively to the design and evaluation of equitable educational initiatives. By matriculating into your esteemed graduate program, I intend to investigate the efficacy of instructional technologies in underserved communities.""",

    # 7. Data science & ethics
    """The exponential expansion of algorithmic decision-making systems across public and private sectors has precipitated urgent inquiries regarding ethical governance and societal impact. Ensuring algorithmic fairness, transparency, and accountability requires rigorous computational methodologies combined with robust philosophical inquiry. Moreover, the mitigation of implicit bias within high-dimensional training corpora remains an active area of empirical investigation. Throughout my undergraduate curriculum, I have prioritized the examination of ethical dimensions within software engineering. I am eager to collaborate with your distinguished faculty to advance research at the intersection of machine intelligence and societal welfare.""",

    # 8. Urban planning & infrastructure
    """Sustainable urban development represents a critical nexus between environmental stewardship, socioeconomic equity, and architectural innovation. The modernization of municipal transit systems and green infrastructure networks significantly mitigates anthropogenic carbon emissions while enhancing urban resilience. Furthermore, the integration of smart-city sensor networks enables metropolitan administrators to optimize resource distribution and urban mobility. My scholarly objectives center on the synthesis of geospatial analysis and public policy to facilitate sustainable urban expansion. Joining your cutting-edge department will provide the academic rigor necessary to implement transformative urban initiatives.""",

    # 9. Corporate governance & leadership
    """In an increasingly volatile and competitive macroeconomic environment, effective corporate governance is essential for ensuring long-term stakeholder value and organizational resilience. Strategic decision-making must reconcile fiduciary obligations with corporate social responsibility and environmental sustainability benchmarks. Furthermore, the adoption of transparent compliance mechanisms mitigates systemic risk and enhances institutional credibility. My professional trajectory has been oriented toward developing comprehensive expertise in corporate restructuring and strategic management.""",

    # 10. Cognitive science & neuroengineering
    """The interdisciplinary convergence of neuroscience, computational modeling, and cognitive psychology offers profound insights into the underlying mechanisms of human cognition and neural computation. Investigating neural plasticity and synaptic transmission dynamics is fundamental for developing next-generation neuroprosthetic interfaces and therapeutic interventions for neurodegenerative disorders. In addition, the integration of high-density neural recording technologies provides unprecedented resolution into complex brain circuitry. My research ambitions encompass the application of quantitative signal processing to neural decoders.""",

    # 11. AI Healthcare Innovation
    """The deployment of artificial intelligence in healthcare optimization represents a transformative paradigm shift in modern clinical diagnostics. Machine learning architectures facilitate rapid pattern recognition across vast medical imaging repositories. Furthermore, predictive algorithms enhance patient risk stratification and treatment planning efficiency.""",

    # 12. Global Supply Chain Resilience
    """In an interconnected global economy, optimizing supply chain logistics requires robust risk mitigation models. Leveraging real-time data analytics enables enterprise leaders to anticipate disruption events and maintain operational continuity across international distribution networks.""",

    # 13. Quantum Computing Paradigm
    """Quantum information processing introduces fundamentally new computational mechanics capable of outperforming classical algorithms in cryptographic and optimization domains. The development of fault-tolerant quantum hardware constitutes a pivotal milestone for scientific research.""",

    # 14. Renewable Energy Grid Integration
    """Transitioning to sustainable power infrastructure demands sophisticated grid management protocols. The integration of distributed renewable assets requires real-time load forecasting algorithms to balance energy generation and consumption efficiently.""",

    # 15. Bioethics & Genomic Engineering
    """Emerging gene editing technologies raise critical ethical and regulatory considerations. Implementing transparent oversight protocols ensures that biotechnological advancements align with clinical safety standards and societal welfare imperatives.""",

    # 16. Cybersecurity Governance
    """Mitigating cyber threats in modern digital ecosystems requires proactive threat intelligence frameworks. Establishing robust encryption protocols and zero-trust architectures protects critical infrastructure against sophisticated adversarial attacks.""",

    # 17. Behavioral Economics & Consumer Choice
    """Understanding the psychological heuristics governing economic decision-making is essential for public policy formulation. Empirical behavioral models provide valuable insights into consumer welfare and market efficiency under conditions of uncertainty.""",

    # 18. Autonomous System Safety
    """The certification of autonomous navigation systems necessitates rigorous safety benchmarks and empirical verification. Multimodal sensor fusion algorithms enable real-time hazard detection across complex operational environments.""",

    # 19. Public Health Epidemic Readiness
    """Enhancing epidemiological surveillance capabilities requires integrated data pipelines across municipal health systems. Rapid outbreak modeling and strategic resource allocation mitigate transmission rates during public health emergencies.""",

    # 20. Natural Language Processing & Semantics
    """Recent breakthroughs in transformer neural architectures have revolutionized computational linguistics. Semantic embedding models enable contextual comprehension across multilingual document corpora, driving unprecedented capabilities in natural language understanding."""
]

class DatasetBuilder:
    @staticmethod
    def create_dataset() -> pd.DataFrame:
        data = []
        for text in SAMPLE_HUMAN_ESSAYS:
            data.append({'text': text.strip(), 'label': 'human'})
        for text in SAMPLE_AI_ESSAYS:
            data.append({'text': text.strip(), 'label': 'ai'})
        
        df = pd.DataFrame(data)
        return df

    @staticmethod
    def validate_dataset(df: pd.DataFrame) -> Tuple[bool, List[str]]:
        issues = []
        if df.empty:
            issues.append("Dataset is empty.")
            return False, issues

        if 'text' not in df.columns or 'label' not in df.columns:
            issues.append("Dataset must contain 'text' and 'label' columns.")
            return False, issues

        null_count = df[['text', 'label']].isnull().sum().sum()
        if null_count > 0:
            issues.append(f"Found {null_count} null entries.")

        short_samples = df[df['text'].apply(lambda x: len(str(x).split())) < 30]
        if not short_samples.empty:
            issues.append(f"Found {len(short_samples)} samples with fewer than 30 words.")

        counts = df['label'].value_counts().to_dict()
        if len(counts) < 2:
            issues.append("Dataset lacks multi-class balance.")

        valid = len(issues) == 0
        return valid, issues
