/**
 * peptides.ts — Master peptide database for The Peptide Alliance.
 *
 * Each entry powers a dedicated SEO landing page at /peptides/[slug].
 * Research summaries, use cases, and mechanism of action are included
 * for each peptide to maximise organic search authority.
 */

export type PeptideCategory =
  | 'performance-recovery'
  | 'growth-hormone'
  | 'weight-loss-metabolic'
  | 'immune-anti-inflammatory'
  | 'sexual-health'
  | 'cognitive-nootropic'
  | 'anti-aging-longevity'
  | 'cosmetic'
  | 'cardiovascular'

export interface Peptide {
  slug: string
  name: string
  alsoKnownAs: string[]
  category: PeptideCategory
  tagline: string
  description: string
  mechanism: string
  useCases: string[]
  researchSummary: string
  typicalDosage: string
  administrationRoutes: string[]
  legalStatus: 'research-chemical' | 'prescription' | 'fda-approved' | 'otc'
  warning: string
  relatedPeptides: string[] // slugs
  searchVolume: 'very-high' | 'high' | 'medium' | 'low'
}

export const PEPTIDES: Peptide[] = [
  // ─── PERFORMANCE & RECOVERY ─────────────────────────────────────────────────
  {
    slug: 'bpc-157',
    name: 'BPC-157',
    alsoKnownAs: ['Body Protection Compound 157', 'PL 14736'],
    category: 'performance-recovery',
    tagline: 'The most studied healing peptide — accelerates tissue repair across muscle, tendon, ligament, and gut.',
    description: 'BPC-157 is a synthetic pentadecapeptide derived from a protective protein found in human gastric juice. It is one of the most researched peptides for tissue regeneration, wound healing, and anti-inflammatory effects. Research has demonstrated accelerated healing of tendons, ligaments, muscles, bones, and the gastrointestinal tract.',
    mechanism: 'BPC-157 promotes angiogenesis (new blood vessel formation), upregulates growth hormone receptors, modulates nitric oxide synthesis, and activates healing-related growth factors including VEGF and EGF. It also exhibits neuroprotective properties via the dopaminergic system.',
    useCases: [
      'Tendon and ligament healing',
      'Muscle tear recovery',
      'Gastrointestinal tract repair (leaky gut, IBD, ulcers)',
      'Post-surgical recovery',
      'Joint pain and inflammation',
      'Traumatic brain injury (TBI) neuroprotection',
      'Bone healing',
    ],
    researchSummary: 'Over 100 preclinical studies in rodent models show BPC-157 accelerates healing of tendons, ligaments, and GI tissue. It has been demonstrated to heal Achilles tendons, rotator cuff injuries, and intestinal anastomoses at significantly faster rates than controls. No Phase III human clinical trials have been completed as of 2025, though Phase I safety studies suggest a favorable profile.',
    typicalDosage: '200–500 mcg per day, subcutaneous or intramuscular injection near injury site. Some protocols use oral delivery for GI conditions.',
    administrationRoutes: ['Subcutaneous injection', 'Intramuscular injection', 'Oral (for GI conditions)'],
    legalStatus: 'research-chemical',
    warning: 'BPC-157 is sold for research purposes only. It is not FDA-approved for human use. Consult a healthcare provider before use.',
    relatedPeptides: ['tb-500', 'bpc-157-tb-500-blend'],
    searchVolume: 'very-high',
  },
  {
    slug: 'tb-500',
    name: 'TB-500',
    alsoKnownAs: ['Thymosin Beta-4', 'Tβ4'],
    category: 'performance-recovery',
    tagline: 'Systemic healing peptide — promotes tissue repair throughout the body with remarkable anti-inflammatory effects.',
    description: 'TB-500 is a synthetic version of Thymosin Beta-4, a naturally occurring peptide found in virtually all human and animal cells. It plays a critical role in actin regulation, cell migration, angiogenesis, and wound healing. Unlike BPC-157 which is best used locally, TB-500 exerts systemic healing effects throughout the body.',
    mechanism: 'TB-500 binds to actin (the protein that forms cellular scaffolding), promoting cell migration and proliferation. It upregulates the expression of beta-4 integrins on cell surfaces, facilitating tissue repair and new blood vessel growth. It also has potent anti-inflammatory properties through inhibition of inflammatory cytokines.',
    useCases: [
      'Systemic tissue healing and recovery',
      'Chronic injury rehabilitation',
      'Cardiac muscle protection post-injury',
      'Hair regrowth (emerging research)',
      'Inflammatory conditions',
      'Athletic performance recovery',
      'Neurological injury support',
    ],
    researchSummary: 'TB-500 has shown efficacy in numerous animal studies including cardiac repair following myocardial infarction, corneal healing, dermal wound closure, and neurological recovery. A Phase II clinical trial studied Thymosin Beta-4 for dry eye syndrome. Preclinical athletic recovery studies show significantly faster return-to-performance metrics.',
    typicalDosage: '2–2.5 mg twice per week during loading phase (4–6 weeks), then 2 mg per month for maintenance. Subcutaneous or intramuscular.',
    administrationRoutes: ['Subcutaneous injection', 'Intramuscular injection'],
    legalStatus: 'research-chemical',
    warning: 'TB-500 is sold for research purposes only. Not FDA-approved for human use. Consult a qualified healthcare provider.',
    relatedPeptides: ['bpc-157', 'bpc-157-tb-500-blend'],
    searchVolume: 'high',
  },
  {
    slug: 'bpc-157-tb-500-blend',
    name: 'BPC-157 + TB-500 Blend',
    alsoKnownAs: ['Healing Blend', 'Recovery Stack', 'BPC/TB Blend'],
    category: 'performance-recovery',
    tagline: 'The gold standard healing stack — combined local and systemic tissue repair in a single protocol.',
    description: 'The BPC-157 and TB-500 combination is widely regarded as the most effective peptide stack for accelerating recovery from injuries. BPC-157 provides targeted, local healing at the injury site while TB-500 delivers systemic anti-inflammatory and regenerative support throughout the body. Together they address both local tissue damage and systemic inflammation simultaneously.',
    mechanism: 'BPC-157 stimulates local angiogenesis and growth factor receptor upregulation at the injury site, while TB-500 promotes systemic actin-based cell migration and proliferation. Their complementary mechanisms create a synergistic healing environment.',
    useCases: [
      'Acute sports injuries',
      'Chronic tendinopathies',
      'Post-surgical acceleration',
      'Multi-site injuries',
      'Comprehensive recovery protocols',
    ],
    researchSummary: 'While limited combined studies exist, the pharmacological mechanisms of BPC-157 and TB-500 are highly complementary. The stack is among the most commonly reported protocols in both clinical peptide therapy settings and research contexts.',
    typicalDosage: 'BPC-157: 250–500 mcg/day. TB-500: 2 mg 2x/week during loading. Can be combined in same syringe.',
    administrationRoutes: ['Subcutaneous injection', 'Intramuscular injection'],
    legalStatus: 'research-chemical',
    warning: 'Research use only. Not FDA-approved. Consult a healthcare provider before combining peptides.',
    relatedPeptides: ['bpc-157', 'tb-500'],
    searchVolume: 'high',
  },

  // ─── GROWTH HORMONE SECRETAGOGUES ───────────────────────────────────────────
  {
    slug: 'cjc-1295',
    name: 'CJC-1295',
    alsoKnownAs: ['CJC-1295 DAC', 'CJC-1295 without DAC', 'Modified GRF 1-29'],
    category: 'growth-hormone',
    tagline: 'Long-acting growth hormone releasing hormone analog — sustained GH pulses for muscle growth, fat loss, and recovery.',
    description: 'CJC-1295 is a synthetic analog of Growth Hormone Releasing Hormone (GHRH). The DAC (Drug Affinity Complex) version has an extended half-life of 6–8 days due to its ability to bind albumin, while the non-DAC version (Modified GRF 1-29) has a shorter half-life of ~30 minutes. Both stimulate the pituitary gland to release growth hormone in natural pulsatile patterns.',
    mechanism: 'CJC-1295 binds to GHRH receptors in the pituitary gland, stimulating growth hormone synthesis and secretion. The DAC version extends activity through covalent albumin binding. This results in increased IGF-1 levels which mediate many of GH\'s anabolic and lipolytic effects.',
    useCases: [
      'Lean muscle mass development',
      'Body fat reduction',
      'Improved sleep quality and recovery',
      'Anti-aging protocols',
      'Growth hormone deficiency (under medical supervision)',
      'Bone density improvement',
    ],
    researchSummary: 'Clinical studies have demonstrated that CJC-1295 significantly increases plasma GH and IGF-1 concentrations in healthy adults. A Phase I/II trial showed sustained GH elevation for up to 14 days with a single injection of the DAC version. Commonly paired with ipamorelin for synergistic GH release.',
    typicalDosage: 'CJC-1295 DAC: 1–2 mg per week. Modified GRF 1-29: 100–200 mcg 2–3x daily, often combined with ipamorelin.',
    administrationRoutes: ['Subcutaneous injection'],
    legalStatus: 'research-chemical',
    warning: 'Research use only. Not FDA-approved. May affect blood glucose. Monitor IGF-1 levels with medical supervision.',
    relatedPeptides: ['ipamorelin', 'sermorelin', 'ghrp-2', 'ghrp-6'],
    searchVolume: 'high',
  },
  {
    slug: 'ipamorelin',
    name: 'Ipamorelin',
    alsoKnownAs: ['NNC 26-0161'],
    category: 'growth-hormone',
    tagline: 'The cleanest GH secretagogue — selective growth hormone release with minimal side effects.',
    description: 'Ipamorelin is a selective Growth Hormone Secretagogue (GHS) and ghrelin receptor agonist. It is widely considered the most selective GHRP available, stimulating GH release without significantly elevating cortisol or prolactin — making it the preferred option for those concerned about side effect profiles. Most commonly paired with CJC-1295 (no DAC).',
    mechanism: 'Ipamorelin mimics ghrelin and binds to the GHS receptor (ghrelin receptor) in the pituitary and hypothalamus, stimulating growth hormone release. Unlike other GHRPs, it has high selectivity and does not cause significant cortisol, prolactin, or ACTH elevations.',
    useCases: [
      'Growth hormone optimization',
      'Lean muscle development',
      'Fat loss acceleration',
      'Improved sleep quality',
      'Recovery and anti-aging',
      'GH deficiency protocols',
    ],
    researchSummary: 'Multiple clinical studies confirm ipamorelin\'s potent and selective GH-releasing activity. It produces a dose-dependent increase in GH without the cortisol and prolactin spikes seen with other GHRPs. The CJC-1295 + Ipamorelin combination is among the most prescribed peptide protocols in anti-aging medicine.',
    typicalDosage: '100–300 mcg 2–3x daily, typically at night 30–60 minutes before sleep on empty stomach. Often stacked with CJC-1295 (no DAC).',
    administrationRoutes: ['Subcutaneous injection'],
    legalStatus: 'research-chemical',
    warning: 'Research use only. Not FDA-approved. Best used under medical supervision with IGF-1 monitoring.',
    relatedPeptides: ['cjc-1295', 'sermorelin', 'ghrp-2', 'hexarelin'],
    searchVolume: 'high',
  },
  {
    slug: 'sermorelin',
    name: 'Sermorelin',
    alsoKnownAs: ['GRF 1-29 NH2', 'GHRH 1-29'],
    category: 'growth-hormone',
    tagline: 'The original GHRH analog — FDA-studied growth hormone therapy with a long safety record.',
    description: 'Sermorelin is a 29-amino acid peptide analog of Growth Hormone Releasing Hormone (GHRH). It was previously FDA-approved as a diagnostic and therapeutic agent before being withdrawn from the US market in 2002 due to manufacturing changes (not safety concerns). It remains one of the most studied GHRH analogs and is widely used in compounding pharmacy GH optimization protocols.',
    mechanism: 'Sermorelin binds to GHRH receptors in the anterior pituitary, stimulating the synthesis and secretion of growth hormone. Unlike exogenous HGH, sermorelin maintains pituitary feedback loops, resulting in more physiological GH release patterns.',
    useCases: [
      'Age-related growth hormone decline',
      'Adult growth hormone deficiency',
      'Body composition improvement',
      'Sleep quality enhancement',
      'Immune function support',
    ],
    researchSummary: 'Sermorelin was studied in multiple FDA-reviewed clinical trials before its withdrawal. Studies demonstrated significant improvements in body composition, sleep quality, and GH levels in adults with GH deficiency. Available through compounding pharmacies under prescriber supervision.',
    typicalDosage: '200–500 mcg before sleep, subcutaneous injection.',
    administrationRoutes: ['Subcutaneous injection'],
    legalStatus: 'prescription',
    warning: 'Available by prescription through compounding pharmacies. Requires medical supervision and baseline hormone testing.',
    relatedPeptides: ['cjc-1295', 'ipamorelin', 'tesamorelin'],
    searchVolume: 'medium',
  },
  {
    slug: 'tesamorelin',
    name: 'Tesamorelin',
    alsoKnownAs: ['Egrifta', 'TH9507'],
    category: 'growth-hormone',
    tagline: 'The only FDA-approved GHRH analog — clinically proven for visceral fat reduction.',
    description: 'Tesamorelin is a synthetic GHRH analog that is FDA-approved for the treatment of HIV-associated lipodystrophy (excess visceral fat). It is the only GHRH peptide with full FDA approval and represents the gold standard of evidence for GHRH efficacy. Used off-label for general body composition improvement and GH optimization.',
    mechanism: 'Tesamorelin stimulates GHRH receptors in the pituitary, increasing GH production and IGF-1 levels. This leads to enhanced lipolysis (fat breakdown), particularly of visceral adipose tissue, as well as improved muscle metabolism.',
    useCases: [
      'Visceral fat reduction (FDA-approved for HIV lipodystrophy)',
      'Body composition optimization (off-label)',
      'Growth hormone optimization',
      'Metabolic syndrome management',
    ],
    researchSummary: 'FDA approval was based on two Phase III randomized controlled trials demonstrating significant reductions in visceral adipose tissue in HIV+ patients. Multiple studies also show favorable body composition effects in non-HIV populations.',
    typicalDosage: '1–2 mg/day subcutaneous injection. FDA-approved dose: 2 mg/day.',
    administrationRoutes: ['Subcutaneous injection'],
    legalStatus: 'prescription',
    warning: 'Prescription only. FDA-approved brand is Egrifta. Available through compounding pharmacies with a prescription.',
    relatedPeptides: ['sermorelin', 'cjc-1295', 'ipamorelin'],
    searchVolume: 'medium',
  },
  {
    slug: 'hexarelin',
    name: 'Hexarelin',
    alsoKnownAs: ['Examorelin', 'MF-6003'],
    category: 'growth-hormone',
    tagline: 'The most potent GHRP — maximum GH release with added cardioprotective properties.',
    description: 'Hexarelin is a potent synthetic hexapeptide and Growth Hormone Releasing Peptide (GHRP). It is considered one of the most potent GHRPs available, producing robust GH release. Unlike other GHRPs, hexarelin also exerts direct cardioprotective effects through CD36 receptor binding, independent of GH release.',
    mechanism: 'Hexarelin activates ghrelin/GHS receptors in the pituitary and hypothalamus for GH release. Additionally, it binds CD36 receptors in cardiac tissue, providing direct cardioprotective effects including improved heart function and protection against ischemic damage.',
    useCases: [
      'Maximum GH stimulation',
      'Cardiac protection and recovery',
      'Muscle and strength development',
      'Recovery from cardiac events (emerging research)',
    ],
    researchSummary: 'Studies show hexarelin produces the highest acute GH release among GHRPs. Cardiac studies demonstrate significant improvements in ventricular function and protection against ischemic injury. Note: tachyphylaxis (reduced response) develops faster with hexarelin than other GHRPs, requiring cycling protocols.',
    typicalDosage: '100–200 mcg 2–3x daily. Should be cycled (4–6 weeks on, 2–4 weeks off) to prevent desensitization.',
    administrationRoutes: ['Subcutaneous injection'],
    legalStatus: 'research-chemical',
    warning: 'Research use only. Not FDA-approved. Causes more cortisol and prolactin elevation than ipamorelin.',
    relatedPeptides: ['ipamorelin', 'ghrp-2', 'ghrp-6', 'cjc-1295'],
    searchVolume: 'medium',
  },
  {
    slug: 'ghrp-2',
    name: 'GHRP-2',
    alsoKnownAs: ['Growth Hormone Releasing Peptide-2', 'Pralmorelin'],
    category: 'growth-hormone',
    tagline: 'Potent and well-studied GH secretagogue — strong evidence base for GH deficiency protocols.',
    description: 'GHRP-2 is one of the most well-studied Growth Hormone Releasing Peptides. It produces potent GH release and has been studied in multiple clinical settings including GH deficiency diagnosis and treatment. It elevates GH more than ipamorelin but less than hexarelin, with moderate cortisol and prolactin effects.',
    mechanism: 'GHRP-2 is a synthetic agonist of the ghrelin receptor (GHS-R1a). It stimulates GH release from the pituitary through both direct pituitary action and hypothalamic GHRH release. Also mildly stimulates appetite via ghrelin pathway activation.',
    useCases: [
      'GH deficiency testing and treatment',
      'Muscle growth and recovery',
      'Fat loss protocols',
      'Anti-aging GH optimization',
    ],
    researchSummary: 'GHRP-2 has been studied in clinical trials as a GH stimulation test and therapeutic agent. Multiple studies confirm potent, dose-dependent GH release. Japanese regulatory approval has been sought for diagnostic use. Strong safety data from decades of research.',
    typicalDosage: '100–300 mcg 2–3x daily, subcutaneous injection, on empty stomach.',
    administrationRoutes: ['Subcutaneous injection'],
    legalStatus: 'research-chemical',
    warning: 'Research use only. Not FDA-approved. May increase appetite significantly.',
    relatedPeptides: ['ghrp-6', 'ipamorelin', 'cjc-1295', 'hexarelin'],
    searchVolume: 'medium',
  },

  // ─── WEIGHT LOSS & METABOLIC ─────────────────────────────────────────────────
  {
    slug: 'semaglutide',
    name: 'Semaglutide',
    alsoKnownAs: ['Ozempic', 'Wegovy', 'Rybelsus', 'GLP-1 agonist'],
    category: 'weight-loss-metabolic',
    tagline: 'The most effective weight loss medication in history — FDA-approved GLP-1 agonist with transformative results.',
    description: 'Semaglutide is a GLP-1 receptor agonist originally developed for type 2 diabetes (Ozempic) and subsequently approved at higher doses for chronic weight management (Wegovy). It has become one of the most prescribed medications globally, demonstrating unprecedented weight loss results in clinical trials — up to 15–17% body weight reduction. Available through compounding pharmacies during FDA drug shortages.',
    mechanism: 'Semaglutide mimics glucagon-like peptide-1 (GLP-1), a gut hormone released after eating. It slows gastric emptying, reduces appetite via central nervous system GLP-1 receptors, enhances insulin secretion, and suppresses glucagon. The net effect is profound reduction in caloric intake and improved metabolic function.',
    useCases: [
      'Chronic weight management (FDA-approved, Wegovy)',
      'Type 2 diabetes management (FDA-approved, Ozempic)',
      'Cardiovascular risk reduction (FDA-approved)',
      'NAFLD/NASH treatment (emerging)',
      'Metabolic syndrome',
    ],
    researchSummary: 'The STEP trial series demonstrated 15–17% weight reduction vs 2–3% for placebo. The SELECT trial showed 20% reduction in MACE (major adverse cardiovascular events). Semaglutide is one of the most evidence-backed weight loss interventions ever studied, with dozens of Phase III and IV trials completed.',
    typicalDosage: 'Wegovy: 0.25 mg/week titrating to 2.4 mg/week. Ozempic: 0.5–2 mg/week. Compounded semaglutide: varies by prescriber protocol.',
    administrationRoutes: ['Subcutaneous injection (weekly)', 'Oral tablet (Rybelsus, daily)'],
    legalStatus: 'prescription',
    warning: 'FDA-approved prescription medication. Available through licensed prescribers and compounding pharmacies. Risk of thyroid C-cell tumors in animal studies. Not for use in patients with personal/family history of MTC.',
    relatedPeptides: ['tirzepatide', 'aod-9604'],
    searchVolume: 'very-high',
  },
  {
    slug: 'tirzepatide',
    name: 'Tirzepatide',
    alsoKnownAs: ['Mounjaro', 'Zepbound', 'GIP/GLP-1 dual agonist'],
    category: 'weight-loss-metabolic',
    tagline: 'Next-generation dual agonist — superior weight loss results by targeting both GIP and GLP-1 receptors.',
    description: 'Tirzepatide is a first-in-class dual GIP and GLP-1 receptor agonist approved by the FDA as Mounjaro (diabetes) and Zepbound (weight management). It demonstrates superior weight loss compared to semaglutide in head-to-head studies, with up to 22.5% body weight reduction in the SURMOUNT-1 trial. Available through compounding pharmacies during FDA drug shortages.',
    mechanism: 'Tirzepatide activates both glucose-dependent insulinotropic polypeptide (GIP) receptors and GLP-1 receptors simultaneously. GIP receptor activation enhances insulin sensitivity, reduces glucagon, and may modulate fat cell metabolism differently than GLP-1 alone. The dual mechanism provides additive and potentially synergistic weight loss effects.',
    useCases: [
      'Chronic weight management (FDA-approved, Zepbound)',
      'Type 2 diabetes (FDA-approved, Mounjaro)',
      'Cardiovascular risk reduction (emerging data)',
      'Sleep apnea (emerging)',
      'Heart failure with preserved ejection fraction (emerging)',
    ],
    researchSummary: 'SURMOUNT-1 trial: 22.5% mean weight reduction at maximum dose vs. 2.4% placebo. SURPASS-2 showed superior A1c reduction vs semaglutide 1 mg. SURMOUNT-OSA showed 63% resolution of sleep apnea symptoms. Currently the most efficacious weight loss medication available.',
    typicalDosage: '2.5 mg/week titrating to 15 mg/week over 20+ weeks. Compounded versions vary by prescriber.',
    administrationRoutes: ['Subcutaneous injection (weekly)'],
    legalStatus: 'prescription',
    warning: 'FDA-approved prescription medication only. Same thyroid C-cell tumor precaution as semaglutide. Requires licensed prescriber.',
    relatedPeptides: ['semaglutide', 'aod-9604'],
    searchVolume: 'very-high',
  },
  {
    slug: 'aod-9604',
    name: 'AOD-9604',
    alsoKnownAs: ['Advanced Obesity Drug 9604', 'HGH Fragment 177-191'],
    category: 'weight-loss-metabolic',
    tagline: 'The fat-burning fragment of HGH — targeted lipolysis without blood sugar effects.',
    description: 'AOD-9604 is a modified fragment of human growth hormone (hGH) spanning amino acids 177–191. It was originally developed by Metabolic Pharmaceuticals as an anti-obesity drug. Unlike full HGH, AOD-9604 stimulates fat breakdown (lipolysis) without affecting IGF-1 levels, blood glucose, or muscle growth. It completed Phase III clinical trials for obesity before the drug program was discontinued.',
    mechanism: 'AOD-9604 mimics the lipolytic action of the C-terminal fragment of HGH by activating beta-3 adrenergic receptors in fat tissue, stimulating breakdown of triglycerides. It inhibits lipogenesis (fat storage) without the glucose-elevating effects of full HGH.',
    useCases: [
      'Targeted fat loss (particularly visceral and subcutaneous)',
      'Body recomposition',
      'Obesity management',
      'Metabolism support',
    ],
    researchSummary: 'AOD-9604 successfully completed Phase I, II, and III clinical trials with an excellent safety profile. Phase IIb trials showed meaningful reductions in body fat vs placebo. The FDA classified it as GRAS (Generally Recognized as Safe) as a food ingredient. Clinical program was discontinued due to modest efficacy relative to emerging GLP-1 options, not safety concerns.',
    typicalDosage: '250–500 mcg/day, subcutaneous injection, on empty stomach in the morning.',
    administrationRoutes: ['Subcutaneous injection', 'Oral (lower bioavailability)'],
    legalStatus: 'research-chemical',
    warning: 'Research use only in the US. Has GRAS status as a food ingredient. Consult a healthcare provider.',
    relatedPeptides: ['semaglutide', 'tirzepatide', 'cjc-1295'],
    searchVolume: 'medium',
  },

  // ─── IMMUNE & ANTI-INFLAMMATORY ─────────────────────────────────────────────
  {
    slug: 'thymosin-alpha-1',
    name: 'Thymosin Alpha-1',
    alsoKnownAs: ['Tα1', 'Thymalfasin', 'Zadaxin'],
    category: 'immune-anti-inflammatory',
    tagline: 'The immune system optimizer — FDA-studied thymic peptide for immune regulation and viral defense.',
    description: 'Thymosin Alpha-1 is a naturally occurring 28-amino acid peptide produced in the thymus gland. It plays a central role in immune regulation — activating T-cells, natural killer (NK) cells, and dendritic cells. It has been approved in over 35 countries under the brand name Zadaxin for treatment of hepatitis B, hepatitis C, and as an adjuvant cancer therapy. It is widely used in functional medicine and longevity protocols.',
    mechanism: 'Thymosin Alpha-1 acts on toll-like receptors (TLR-9) and stimulates the differentiation and proliferation of T-lymphocytes. It enhances NK cell activity, promotes Th1 cytokine responses (interferon-gamma, IL-2), and modulates inflammatory pathways to promote immune homeostasis rather than simple stimulation.',
    useCases: [
      'Immune system modulation and optimization',
      'Chronic viral infections (hepatitis B, C, EBV, Lyme)',
      'Cancer immunotherapy adjuvant',
      'Post-COVID immune dysregulation',
      'Chronic fatigue syndrome and MECFS',
      'Autoimmune conditions (immune regulation)',
      'Mold/mycotoxin illness',
    ],
    researchSummary: 'Thymosin Alpha-1 has been studied in over 50 randomized controlled trials. FDA Orphan Drug designation was granted for DiGeorge syndrome. Approved in 35+ countries for hepatitis and cancer. A 2020 study in China demonstrated improved survival in COVID-19 critically ill patients treated with Thymosin Alpha-1.',
    typicalDosage: '1.6 mg subcutaneous injection 1–2x weekly. Some protocols use 900 mcg 3x weekly for immune support.',
    administrationRoutes: ['Subcutaneous injection'],
    legalStatus: 'research-chemical',
    warning: 'Research use only in the US. Approved as Zadaxin in 35+ countries. Consult immunologist for complex immune conditions.',
    relatedPeptides: ['tb-500', 'bpc-157'],
    searchVolume: 'medium',
  },
  {
    slug: 'll-37',
    name: 'LL-37',
    alsoKnownAs: ['Cathelicidin', 'hCAP-18 C-terminal peptide', 'CAMP peptide'],
    category: 'immune-anti-inflammatory',
    tagline: 'The human antimicrobial peptide — broad-spectrum pathogen defense with immune signaling properties.',
    description: 'LL-37 is the only member of the cathelicidin family of antimicrobial peptides expressed in humans. It is produced by neutrophils, macrophages, and epithelial cells in response to infection. It has broad-spectrum antimicrobial activity against bacteria, viruses, fungi, and parasites, while also modulating immune responses. Deficiency has been linked to increased susceptibility to infections and inflammatory conditions.',
    mechanism: 'LL-37 disrupts bacterial cell membranes through direct membrane interaction. It also acts as a chemokine, attracting immune cells to sites of infection, modulates TLR signaling, promotes wound healing via receptor tyrosine kinase activation, and suppresses excessive inflammatory responses via NF-κB pathway modulation.',
    useCases: [
      'Chronic bacterial/viral infections',
      'Antimicrobial defense support',
      'Wound healing (topical)',
      'Gut dysbiosis and microbiome support',
      'Lung conditions (COPD, cystic fibrosis)',
      'Skin conditions (rosacea, psoriasis)',
    ],
    researchSummary: 'Extensive preclinical evidence supports LL-37 in antimicrobial, wound healing, and immunomodulatory applications. Clinical research is ongoing in cystic fibrosis, chronic wounds, and cutaneous conditions. Lower LL-37 levels are associated with increased infection susceptibility in several disease states.',
    typicalDosage: 'Protocols vary: 100–500 mcg subcutaneous injection. Topical formulations also available for skin/wound applications.',
    administrationRoutes: ['Subcutaneous injection', 'Intranasal', 'Topical'],
    legalStatus: 'research-chemical',
    warning: 'Research use only. Not FDA-approved for human therapeutic use. Use under qualified medical supervision.',
    relatedPeptides: ['thymosin-alpha-1', 'bpc-157'],
    searchVolume: 'low',
  },

  // ─── SEXUAL HEALTH ───────────────────────────────────────────────────────────
  {
    slug: 'pt-141',
    name: 'PT-141',
    alsoKnownAs: ['Bremelanotide', 'Vyleesi', 'Melanocyte-Stimulating Hormone'],
    category: 'sexual-health',
    tagline: 'The first FDA-approved peptide for sexual dysfunction — centrally acting with proven clinical results.',
    description: 'PT-141 (Bremelanotide) is a synthetic melanocortin peptide and the first FDA-approved treatment for hypoactive sexual desire disorder (HSDD) in premenopausal women (brand name Vyleesi). Unlike PDE5 inhibitors (sildenafil/tadalafil) which work through vascular mechanisms, PT-141 acts centrally through melanocortin receptors in the brain to enhance sexual desire and arousal in both women and men.',
    mechanism: 'PT-141 is an agonist of melanocortin receptors (MC3R and MC4R) in the hypothalamus and limbic system. This central mechanism directly increases sexual desire and arousal pathways, rather than working through vascular or hormonal changes.',
    useCases: [
      'Hypoactive sexual desire disorder (FDA-approved for women)',
      'Female sexual arousal disorder',
      'Male erectile dysfunction and libido (off-label)',
      'Sexual dysfunction in both sexes',
    ],
    researchSummary: 'FDA approval was based on RECONNECT trials demonstrating significantly increased satisfying sexual events and reduced distress in women with HSDD. Off-label male studies show improved erectile function and libido, particularly effective when PDE5 inhibitors have failed.',
    typicalDosage: 'FDA-approved: 1.75 mg subcutaneous injection 45 minutes before anticipated sexual activity (max 1x per 24 hours, 8x per month). Off-label male dose: 1–2 mg.',
    administrationRoutes: ['Subcutaneous injection'],
    legalStatus: 'prescription',
    warning: 'FDA-approved (Vyleesi) for women with HSDD. Requires prescription. May cause nausea, flushing, and transient blood pressure increases.',
    relatedPeptides: ['kisspeptin-10'],
    searchVolume: 'high',
  },
  {
    slug: 'kisspeptin-10',
    name: 'Kisspeptin-10',
    alsoKnownAs: ['Kp-10', 'Metastin 45-54', 'KISS1 peptide'],
    category: 'sexual-health',
    tagline: 'Emerging neuroendocrine peptide — regulates reproductive hormones with promising fertility and libido applications.',
    description: 'Kisspeptin is a neuropeptide produced in the hypothalamus that serves as the primary regulator of the reproductive axis (HPG axis). Kisspeptin-10 is the shortest active fragment. It stimulates gonadotropin-releasing hormone (GnRH) release, leading to downstream increases in LH, FSH, testosterone, and estrogen. Used in clinical research for fertility treatment, hypogonadism, and sexual function.',
    mechanism: 'Kisspeptin binds KISS1 receptors on GnRH neurons in the hypothalamus, causing robust pulsatile GnRH release. This stimulates LH and FSH from the pituitary, which drives gonadal hormone production. The pathway is essential for puberty onset and maintenance of reproductive function.',
    useCases: [
      'Hypogonadotropic hypogonadism',
      'Male fertility and testosterone optimization',
      'Female fertility treatment',
      'Libido enhancement',
      'Post-TRT/steroid recovery (HPTA restoration)',
    ],
    researchSummary: 'Clinical trials at multiple academic medical centers have demonstrated kisspeptin\'s ability to stimulate LH and testosterone in hypogonadal males and trigger ovulation in females with hypothalamic amenorrhea. Published Phase I/II studies show excellent safety and tolerability.',
    typicalDosage: 'Research protocols vary: 0.25–3 nmol/kg IV in studies. Subcutaneous doses in practice range 2–10 mcg/kg.',
    administrationRoutes: ['Subcutaneous injection', 'Intravenous (research)'],
    legalStatus: 'research-chemical',
    warning: 'Research use only. Not FDA-approved. Clinical trials are ongoing. Use under endocrinology supervision.',
    relatedPeptides: ['pt-141'],
    searchVolume: 'low',
  },

  // ─── COGNITIVE & NOOTROPIC ───────────────────────────────────────────────────
  {
    slug: 'selank',
    name: 'Selank',
    alsoKnownAs: ['TP-7', 'Selank nasal spray', 'Tuftsin analog'],
    category: 'cognitive-nootropic',
    tagline: 'Russian-developed anxiolytic and cognitive enhancer — anti-anxiety without sedation or dependence.',
    description: 'Selank is a synthetic heptapeptide analog of tuftsin, developed by the Institute of Molecular Genetics of the Russian Academy of Sciences. It is approved in Russia for anxiety, asthenic conditions, and immunodeficiency. It has anxiolytic effects comparable to benzodiazepines without sedation, dependence potential, or cognitive impairment. Also demonstrates memory enhancement and nootropic properties.',
    mechanism: 'Selank modulates the expression of GABA-A receptor subunits, producing anxiolytic effects through GABAergic pathways. It also increases BDNF expression (brain-derived neurotrophic factor), modulates monoamine neurotransmitters (serotonin, dopamine), and has anti-inflammatory properties via cytokine modulation.',
    useCases: [
      'Anxiety and stress reduction',
      'Cognitive enhancement and memory',
      'Depression (as adjunct)',
      'Immune system modulation',
      'ADHD and focus improvement',
    ],
    researchSummary: 'Approved and widely prescribed in Russia. Multiple published Russian clinical trials demonstrate efficacy for generalized anxiety disorder, phobias, and asthenic conditions with excellent tolerability. Animal studies consistently show memory enhancement and anxiolytic effects without dependence.',
    typicalDosage: '250–3000 mcg intranasal (most common) or subcutaneous. Nasal spray allows easy dosing.',
    administrationRoutes: ['Intranasal spray', 'Subcutaneous injection'],
    legalStatus: 'research-chemical',
    warning: 'Research use only in the US. Approved in Russia. Not scheduled/controlled in US. Consult physician for anxiety treatment.',
    relatedPeptides: ['semax', 'dihexa'],
    searchVolume: 'medium',
  },
  {
    slug: 'semax',
    name: 'Semax',
    alsoKnownAs: ['ACTH 4-7 analog', 'Cognitive enhancer peptide', 'Neuropeptide Semax'],
    category: 'cognitive-nootropic',
    tagline: 'BDNF-boosting cognitive enhancer — improves memory, focus, and neuroprotection.',
    description: 'Semax is a synthetic heptapeptide based on the ACTH 4-10 fragment, developed and approved in Russia for neurological conditions including stroke, cognitive impairment, and optic nerve disease. It is a potent stimulator of BDNF and NGF (nerve growth factor), making it one of the most studied neuroprotective and cognitive-enhancing peptides available.',
    mechanism: 'Semax increases BDNF and NGF synthesis in the brain, promoting neuronal growth, survival, and synaptic plasticity. It also modulates dopaminergic and serotonergic systems, stimulates melanocortin receptors, and exerts anti-inflammatory effects in neural tissue.',
    useCases: [
      'Cognitive enhancement and memory',
      'Focus and attention (ADHD support)',
      'Neuroprotection after stroke or TBI',
      'Depression and mood support',
      'Optic nerve conditions',
      'Neurodegenerative disease support',
    ],
    researchSummary: 'Approved in Russia for ischemic stroke, TBI, optic nerve disease, and cognitive decline. Multiple RCTs demonstrate significant cognitive improvements and neuroprotection. One of the most prescribed neuropeptide treatments in Russian clinical medicine for over 20 years.',
    typicalDosage: '100–300 mcg intranasal, 1–2x daily. N-Acetyl Semax version extends half-life.',
    administrationRoutes: ['Intranasal spray', 'Subcutaneous injection'],
    legalStatus: 'research-chemical',
    warning: 'Research use only in the US. Approved in Russia. May cause transient anxiety at higher doses.',
    relatedPeptides: ['selank', 'dihexa'],
    searchVolume: 'medium',
  },
  {
    slug: 'dihexa',
    name: 'Dihexa',
    alsoKnownAs: ['N-hexanoic-Tyr-Ile-(6) aminohexanoic amide', 'PNB0408'],
    category: 'cognitive-nootropic',
    tagline: 'The most potent cognitive enhancer yet studied — 10 million times more potent than BDNF at synaptic formation.',
    description: 'Dihexa is a small peptide derived from Angiotensin IV that has demonstrated extraordinary potency in cognitive enhancement models. Research at Washington State University showed it was 10 million times more potent than BDNF in facilitating synaptogenesis (new synapse formation). It is being investigated for Alzheimer\'s disease, cognitive impairment, and social cognition deficits.',
    mechanism: 'Dihexa binds to hepatocyte growth factor (HGF) and potentiates its receptor c-Met, leading to profound synaptic growth and cognitive enhancement. This pathway is distinct from all other known cognitive enhancers, making Dihexa potentially useful in treatment-resistant cognitive conditions.',
    useCases: [
      'Alzheimer\'s disease and dementia (research)',
      'Cognitive enhancement in healthy individuals',
      'Recovery from traumatic brain injury',
      'Social cognition improvement',
      'Age-related cognitive decline',
    ],
    researchSummary: 'Animal studies from WSU demonstrate remarkable reversal of cognitive deficits in aged rats and disease models. The synaptogenic potency exceeds BDNF by orders of magnitude. Human research is in early stages. Currently one of the most discussed cognitive peptides in longevity and biohacking communities.',
    typicalDosage: 'Research doses: 0.1–10 mg/kg in animal studies. Human protocols in practice range from 10–30 mg oral or 1–5 mg subcutaneous.',
    administrationRoutes: ['Subcutaneous injection', 'Oral', 'Transdermal'],
    legalStatus: 'research-chemical',
    warning: 'Research use only. Very limited human safety data. Extremely potent — use with caution and under qualified supervision.',
    relatedPeptides: ['semax', 'selank'],
    searchVolume: 'low',
  },

  // ─── ANTI-AGING & LONGEVITY ───────────────────────────────────────────────────
  {
    slug: 'epithalon',
    name: 'Epithalon',
    alsoKnownAs: ['Epitalon', 'Epithalone', 'Epithalamin', 'Tetrapeptide ALA-GLU-ASP-GLY'],
    category: 'anti-aging-longevity',
    tagline: 'The telomere peptide — restores telomerase activity for cellular aging reversal.',
    description: 'Epithalon is a synthetic tetrapeptide (Ala-Glu-Asp-Gly) developed by the St. Petersburg Institute of Bioregulation and Gerontology. Based on the endogenous thymic peptide Epithalamin, it is one of the most studied longevity peptides with over 100 studies and 40+ years of research. It activates telomerase, lengthens telomeres, and has demonstrated life extension in animal models.',
    mechanism: 'Epithalon activates the enzyme telomerase (which extends telomeres — the protective caps at the ends of chromosomes that shorten with age), normalizes pineal gland function and melatonin production, modulates cortisol/TSH levels, and exerts antioxidant and anti-tumor properties.',
    useCases: [
      'Telomere restoration and anti-aging',
      'Sleep quality improvement',
      'Immune system regulation',
      'Antioxidant protection',
      'Hormonal normalization in aging',
      'Cancer prevention (preclinical research)',
    ],
    researchSummary: 'Over 100 published studies, primarily from Russian and Ukrainian institutes. Multiple animal studies demonstrate 24–33% life extension. Human studies show improvements in biomarkers of aging, improved sleep, immune function, and antioxidant capacity. One of the few peptides with genuine telomerase activation evidence in humans.',
    typicalDosage: '5–10 mg/day for 10–20 day cycles, 2x per year. Subcutaneous or IV. Some protocols use every-other-day dosing.',
    administrationRoutes: ['Subcutaneous injection', 'Intravenous'],
    legalStatus: 'research-chemical',
    warning: 'Research use only. Not FDA-approved. Long-term human safety data primarily from Russian research.',
    relatedPeptides: ['ghk-cu', 'thymosin-alpha-1'],
    searchVolume: 'medium',
  },
  {
    slug: 'ghk-cu',
    name: 'GHK-Cu',
    alsoKnownAs: ['Copper Peptide', 'Glycyl-L-histidyl-L-lysine copper', 'Regenacol'],
    category: 'anti-aging-longevity',
    tagline: 'The master wound healing and anti-aging copper peptide — resets over 4,000 genes to a younger state.',
    description: 'GHK-Cu is a naturally occurring copper-binding tripeptide that declines significantly with age (peak in young adulthood, declining ~60% by age 60). Discovered in 1973, it has demonstrated remarkable ability to activate genes associated with tissue repair, collagen synthesis, stem cell activation, antioxidant defense, and anti-aging. It affects expression of over 4,000 genes.',
    mechanism: 'GHK-Cu activates tissue remodeling proteins (MMPs and TIMPs), promotes collagen and glycosaminoglycan synthesis, activates stem cell populations, stimulates nerve outgrowth, exerts anti-inflammatory effects via TNF-alpha suppression, and activates the proteasome for cellular protein cleanup.',
    useCases: [
      'Skin anti-aging (collagen, elastin, wound healing)',
      'Hair regrowth and follicle stimulation',
      'Wound healing acceleration',
      'Systemic anti-aging protocols',
      'Neurodegenerative conditions (BDNF upregulation)',
      'Lung tissue repair',
    ],
    researchSummary: 'Over 50 years of research. Human studies demonstrate significant skin improvements in wrinkle depth, skin tightening, and collagen density. Gene expression analyses show reversal of over 4,000 age-related gene changes. Strong wound healing evidence from dermatological studies. Hair regrowth comparable to minoxidil in some studies.',
    typicalDosage: 'Topical: 0.1–2% cream/serum formulation. Systemic: 2–3 mg subcutaneous daily. Injectable protocols typically 2 mg/day for 4–6 week cycles.',
    administrationRoutes: ['Topical cream/serum', 'Subcutaneous injection'],
    legalStatus: 'otc',
    warning: 'Topical formulations are OTC cosmetic products. Injectable GHK-Cu is sold as a research chemical. Consult a provider for injectable protocols.',
    relatedPeptides: ['epithalon', 'bpc-157'],
    searchVolume: 'medium',
  },

  // ─── COSMETIC PEPTIDES ───────────────────────────────────────────────────────
  {
    slug: 'argireline',
    name: 'Argireline',
    alsoKnownAs: ['Acetyl Hexapeptide-3', 'Acetyl Hexapeptide-8', 'Snap-8'],
    category: 'cosmetic',
    tagline: 'Topical botox alternative — reduces expression lines without needles.',
    description: 'Argireline (Acetyl Hexapeptide-3/8) is a synthetic peptide derived from SNAP-25, a protein involved in the release of neurotransmitters at the neuromuscular junction. Applied topically, it competes with SNAP-25 to reduce facial muscle contraction, producing a botulinum toxin-like effect. It is one of the most widely studied cosmetic peptides with strong clinical evidence for wrinkle reduction.',
    mechanism: 'Argireline mimics the N-terminal end of SNAP-25 and competes for binding to the SNARE complex in facial muscles, inhibiting neurotransmitter release at neuromuscular junctions. This causes a controlled relaxation of facial expression muscles, reducing the appearance of dynamic expression lines.',
    useCases: [
      'Expression line and wrinkle reduction',
      'Forehead and eye area anti-aging',
      'Non-invasive alternative to botox',
      'Skin tightening formulations',
    ],
    researchSummary: 'Multiple clinical studies demonstrate 17–30% reduction in wrinkle depth with topical application. The SNAP-8 version (8 amino acids) shows enhanced efficacy vs. the original 6-amino-acid version. Widely used in premium cosmetic formulations globally.',
    typicalDosage: 'Topical: 2–10% concentration in serums or creams applied 1–2x daily.',
    administrationRoutes: ['Topical cream/serum'],
    legalStatus: 'otc',
    warning: 'Topical cosmetic product. Generally recognized as safe. Avoid contact with eyes.',
    relatedPeptides: ['ghk-cu'],
    searchVolume: 'medium',
  },

  // ─── CARDIOVASCULAR ──────────────────────────────────────────────────────────
  {
    slug: 'ss-31',
    name: 'SS-31',
    alsoKnownAs: ['Elamipretide', 'Bendavia', 'MTP-131', 'Szeto-Schiller peptide 31'],
    category: 'cardiovascular',
    tagline: 'Mitochondria-targeting peptide — protects cellular energy production in heart, muscle, and kidney.',
    description: 'SS-31 (Elamipretide) is a cell-permeable peptide that targets the inner mitochondrial membrane, where it stabilizes cardiolipin — a phospholipid critical for electron transport chain efficiency. It has shown remarkable protective effects in cardiac ischemia-reperfusion injury, heart failure, and renal conditions. Currently in Phase III clinical trials for heart failure with reduced ejection fraction.',
    mechanism: 'SS-31 concentrates in the inner mitochondrial membrane and interacts with cardiolipin, preventing its oxidation and maintaining the structure of electron transport chain supercomplexes. This reduces reactive oxygen species (ROS) production, maintains ATP synthesis, and prevents mitochondrial membrane permeability transition pore (mPTP) opening during cellular stress.',
    useCases: [
      'Heart failure protection and treatment',
      'Cardiac ischemia-reperfusion injury',
      'Chronic kidney disease (Phase II data)',
      'Muscle weakness and fatigue (mitochondrial)',
      'Age-related mitochondrial dysfunction',
      'Exercise performance and recovery',
    ],
    researchSummary: 'Phase II PROGRESS-HF trial showed significant improvements in 6-minute walk distance in heart failure patients. Phase III HEART-FID trial of elamipretide ongoing. Multiple Phase I/II trials in cardiac surgery, renal disease, and mitochondrial myopathy. Landmark research from Hazel Szeto at Weill Cornell.',
    typicalDosage: 'Clinical trials: 40 mg/day subcutaneous. Research protocols: 0.01–10 mg/kg. Dosing varies significantly by indication.',
    administrationRoutes: ['Subcutaneous injection', 'Intravenous (clinical trials)'],
    legalStatus: 'research-chemical',
    warning: 'Research use only. Phase III trials ongoing. Not FDA-approved for any indication as of 2025.',
    relatedPeptides: ['tb-500', 'epithalon'],
    searchVolume: 'low',
  },
]

// Organize by category for the index page
export const PEPTIDE_CATEGORIES: Record<PeptideCategory, { label: string; description: string; color: string }> = {
  'performance-recovery': {
    label: 'Performance & Recovery',
    description: 'Peptides for accelerated healing, injury recovery, and athletic performance',
    color: '#2B5EBE',
  },
  'growth-hormone': {
    label: 'Growth Hormone Peptides',
    description: 'GHRH analogs and GH secretagogues for body composition, sleep, and anti-aging',
    color: '#0d7c3e',
  },
  'weight-loss-metabolic': {
    label: 'Weight Loss & Metabolic',
    description: 'GLP-1 agonists and metabolic peptides for weight management',
    color: '#7c3aed',
  },
  'immune-anti-inflammatory': {
    label: 'Immune & Anti-Inflammatory',
    description: 'Peptides for immune modulation, infection defense, and inflammation control',
    color: '#b45309',
  },
  'sexual-health': {
    label: 'Sexual Health',
    description: 'Centrally-acting peptides for sexual function and desire',
    color: '#be185d',
  },
  'cognitive-nootropic': {
    label: 'Cognitive & Nootropic',
    description: 'Neuropeptides for memory, focus, anxiety, and brain health',
    color: '#0369a1',
  },
  'anti-aging-longevity': {
    label: 'Anti-Aging & Longevity',
    description: 'Peptides targeting the fundamental mechanisms of aging',
    color: '#9a3412',
  },
  'cosmetic': {
    label: 'Cosmetic Peptides',
    description: 'Topical peptides for skin anti-aging, wrinkle reduction, and hair growth',
    color: '#4a1d96',
  },
  'cardiovascular': {
    label: 'Cardiovascular',
    description: 'Peptides for heart protection, mitochondrial health, and vascular function',
    color: '#991b1b',
  },
}

export function getPeptideBySlug(slug: string): Peptide | undefined {
  return PEPTIDES.find(p => p.slug === slug)
}

export function getPeptidesByCategory(category: PeptideCategory): Peptide[] {
  return PEPTIDES.filter(p => p.category === category)
}

export function getRelatedPeptides(peptide: Peptide): Peptide[] {
  return peptide.relatedPeptides
    .map(slug => getPeptideBySlug(slug))
    .filter(Boolean) as Peptide[]
}

export const ALL_PEPTIDE_SLUGS = PEPTIDES.map(p => p.slug)
