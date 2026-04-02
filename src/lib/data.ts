import { PostWithDetails, CommentWithDetails, CategoryInfo, UserProfile } from "./types";

const now = new Date().toISOString();
const hourAgo = new Date(Date.now() - 3600000).toISOString();
const dayAgo = new Date(Date.now() - 86400000).toISOString();
const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString();
const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
const twoWeeksAgo = new Date(Date.now() - 14 * 86400000).toISOString();
const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString();

export const categories: CategoryInfo[] = [
  { id: "cat1", name: "Laser Systems", slug: "laser-systems", description: "Discussion about laser design, operation, and applications including solid-state, fiber, gas, and semiconductor lasers.", color: "#ef4444", _count: { posts: 3 } },
  { id: "cat2", name: "Fiber Optics", slug: "fiber-optics", description: "Optical fiber technologies, telecommunications, fiber sensors, and fiber-based devices.", color: "#f59e0b", _count: { posts: 1 } },
  { id: "cat3", name: "Optical Design", slug: "optical-design", description: "Lens design, optical systems, aberration theory, and ray tracing.", color: "#10b981", _count: { posts: 1 } },
  { id: "cat4", name: "Quantum Optics", slug: "quantum-optics", description: "Quantum entanglement, single-photon sources, quantum cryptography, and quantum computing with photons.", color: "#8b5cf6", _count: { posts: 1 } },
  { id: "cat5", name: "Photonic Integrated Circuits", slug: "photonic-integrated-circuits", description: "Silicon photonics, PICs, waveguide design, modulators, and on-chip optical interconnects.", color: "#06b6d4", _count: { posts: 1 } },
  { id: "cat6", name: "Spectroscopy", slug: "spectroscopy", description: "Raman, FTIR, UV-Vis, fluorescence spectroscopy techniques and instrumentation.", color: "#ec4899", _count: { posts: 1 } },
  { id: "cat7", name: "Nonlinear Optics", slug: "nonlinear-optics", description: "Frequency conversion, optical parametric oscillators, Kerr effect, and nonlinear materials.", color: "#f97316", _count: { posts: 0 } },
  { id: "cat8", name: "Biophotonics", slug: "biophotonics", description: "Optical imaging in biology, OCT, fluorescence microscopy, and photodynamic therapy.", color: "#22c55e", _count: { posts: 1 } },
  { id: "cat9", name: "Optical Communications", slug: "optical-communications", description: "Free-space optical communications, WDM, coherent detection, and optical networking.", color: "#3b82f6", _count: { posts: 1 } },
  { id: "cat10", name: "Metamaterials & Nanophotonics", slug: "metamaterials-nanophotonics", description: "Plasmonic structures, photonic crystals, metasurfaces, and nanoscale light manipulation.", color: "#a855f7", _count: { posts: 1 } },
];

export const users: UserProfile[] = [
  { id: "u1", username: "laserphysicist", displayName: "Dr. Sarah Chen", bio: "Laser physicist at Stanford. Working on ultrafast fiber lasers and frequency combs.", createdAt: monthAgo },
  { id: "u2", username: "photon_wizard", displayName: "Marcus Rivera", bio: "Photonic IC designer. Passionate about silicon photonics and co-packaged optics.", createdAt: monthAgo },
  { id: "u3", username: "quantum_optics_phd", displayName: "Aisha Patel", bio: "PhD candidate in quantum optics. Researching entangled photon pair sources.", createdAt: monthAgo },
  { id: "u4", username: "fiber_guru", displayName: "James O'Brien", bio: "20+ years in fiber optic telecommunications. Currently at Corning.", createdAt: monthAgo },
];

export const posts: PostWithDetails[] = [
  {
    id: "p1",
    title: "Thermal lensing compensation in high-power fiber lasers \u2014 what approaches are you using?",
    body: "I'm working on a 2kW CW fiber laser system and running into significant thermal lensing effects in the delivery optics. The beam quality degrades noticeably after ~30 minutes of operation.\n\nWe've tried:\n- Active cooling of the collimator assembly\n- Using low-absorption fused silica optics\n- Adaptive optics (deformable mirror)\n\nThe deformable mirror approach works best but adds significant cost and complexity. Has anyone had success with simpler passive compensation approaches?\n\nI've read about gradient-index materials that could self-compensate, but haven't found much practical implementation data.\n\nAny references or practical experience would be greatly appreciated!",
    type: "question", score: 42, createdAt: dayAgo, updatedAt: dayAgo,
    author: { id: "u1", username: "laserphysicist", displayName: "Dr. Sarah Chen" },
    categories: [{ category: { id: "cat1", name: "Laser Systems", slug: "laser-systems", color: "#ef4444" } }, { category: { id: "cat2", name: "Fiber Optics", slug: "fiber-optics", color: "#f59e0b" } }],
    _count: { comments: 1 },
  },
  {
    id: "p2",
    title: "New results: sub-wavelength grating couplers achieving 0.9 dB insertion loss on SiN platform",
    body: "Our group just published results on a novel sub-wavelength grating (SWG) coupler design for silicon nitride PICs that achieves record-low insertion loss.\n\n## Key Results\n\n- **Insertion loss**: 0.9 dB at 1550 nm (best device), 1.1 dB average across wafer\n- **1-dB bandwidth**: 68 nm\n- **Polarization**: TE mode\n- **Footprint**: 12 \u03bcm \u00d7 15 \u03bcm\n\n## Design Approach\n\nWe used an apodized SWG where the fill factor varies along the coupler length following an optimized polynomial profile. The key insight was co-optimizing the etch depth and SWG period simultaneously using inverse design.\n\nThe fabrication was done at a commercial foundry (IMEC) on their standard SiN platform, so this is immediately manufacturable.\n\nHappy to discuss the design methodology and share simulation files if there's interest!",
    type: "discussion", score: 87, createdAt: twoDaysAgo, updatedAt: twoDaysAgo,
    author: { id: "u2", username: "photon_wizard", displayName: "Marcus Rivera" },
    categories: [{ category: { id: "cat5", name: "Photonic Integrated Circuits", slug: "photonic-integrated-circuits", color: "#06b6d4" } }],
    _count: { comments: 2 },
  },
  {
    id: "p3",
    title: "Has anyone characterized Hong-Ou-Mandel interference visibility with PPLN waveguide sources?",
    body: "I'm building a heralded single-photon source using SPDC in a PPLN waveguide, targeting photon pairs at 1550 nm for quantum key distribution experiments.\n\nI'm trying to achieve >95% HOM visibility between photons from two independent sources. Currently getting about 88% and struggling to improve further.\n\nMy suspicion is that spectral distinguishability is the main limitation. I'm using 10 nm bandpass filters for spectral selection, but the joint spectral amplitude might not be pure enough.\n\nQuestions:\n1. What spectral filtering bandwidth have others found optimal for PPLN sources?\n2. Is it worth investing in custom poling profiles for spectrally pure states?\n3. Any recommendations for fiber-coupled narrowband filters at telecom wavelengths?\n\nThanks in advance!",
    type: "question", score: 31, createdAt: weekAgo, updatedAt: weekAgo,
    author: { id: "u3", username: "quantum_optics_phd", displayName: "Aisha Patel" },
    categories: [{ category: { id: "cat4", name: "Quantum Optics", slug: "quantum-optics", color: "#8b5cf6" } }, { category: { id: "cat9", name: "Optical Communications", slug: "optical-communications", color: "#3b82f6" } }],
    _count: { comments: 1 },
  },
  {
    id: "p4",
    title: "Guide: Setting up a home Raman spectroscopy system on a budget",
    body: "After a year of collecting parts and building, I've assembled a decent Raman spectroscopy setup for under $3,000. Here's how:\n\n## Components\n\n1. **Laser**: 532 nm DPSS laser, 50 mW ($150 from a reputable supplier \u2014 NOT a cheap laser pointer)\n2. **Spectrometer**: Used Ocean Optics USB2000+ from eBay ($600)\n3. **Notch filter**: OD6 532nm notch filter from Thorlabs ($350)\n4. **Collection optics**: Assorted Thorlabs lenses and mounts ($800)\n5. **Probe**: Custom fiber-coupled probe design ($400 in parts)\n6. **Software**: Python + scipy for data analysis (free!)\n\n## Safety First\n**Laser safety is critical.** I have proper OD7+ goggles, an interlocked enclosure, and beam termination. Do NOT skip safety measures.\n\n## Results\nI can reliably identify common minerals, pharmaceuticals (checking supplements), and polymers. The spectral resolution is about 8 cm\u207b\u00b9, which is sufficient for most identification tasks.\n\nFull build guide with CAD files is on my GitHub. Happy to answer questions!",
    type: "discussion", score: 156, createdAt: hourAgo, updatedAt: hourAgo,
    author: { id: "u4", username: "fiber_guru", displayName: "James O'Brien" },
    categories: [{ category: { id: "cat6", name: "Spectroscopy", slug: "spectroscopy", color: "#ec4899" } }, { category: { id: "cat1", name: "Laser Systems", slug: "laser-systems", color: "#ef4444" } }],
    _count: { comments: 1 },
  },
  {
    id: "p5",
    title: "Plasmonic metasurface achieving 89% efficiency for beam steering at 10.6 \u03bcm \u2014 breaking the theoretical limit?",
    body: "Just came across a preprint claiming 89% diffraction efficiency for a plasmonic metasurface beam steerer at CO2 laser wavelengths (10.6 \u03bcm). This seems remarkably high for a plasmonic structure.\n\nThe design uses gold nanoantennas on a ZnSe substrate with a geometric phase (Pancharatnam-Berry) approach.\n\nA few things that surprise me:\n- Ohmic losses in gold at MIR wavelengths should be non-negligible\n- They claim sub-wavelength pitch without higher-order diffraction issues\n- The angular range is \u00b160\u00b0 which seems aggressive\n\nHas anyone with metasurface expertise had a chance to evaluate this work? The simulation methodology section is light on details, which always raises flags for me.\n\nNot trying to be unfairly critical \u2014 the results would be genuinely exciting if validated. Just want to discuss with the community.",
    type: "discussion", score: 65, createdAt: twoWeeksAgo, updatedAt: twoWeeksAgo,
    author: { id: "u1", username: "laserphysicist", displayName: "Dr. Sarah Chen" },
    categories: [{ category: { id: "cat10", name: "Metamaterials & Nanophotonics", slug: "metamaterials-nanophotonics", color: "#a855f7" } }],
    _count: { comments: 1 },
  },
  {
    id: "p6",
    title: "Comparison: OCT vs. confocal microscopy for retinal imaging \u2014 when to use which?",
    body: "I'm a new postdoc setting up an ophthalmic imaging lab and would appreciate the community's practical insights on choosing between OCT and confocal scanning laser ophthalmoscopy (cSLO) for different retinal studies.\n\nI understand the theoretical differences, but I'm looking for practical guidance:\n\n- For longitudinal studies of retinal layer thickness, OCT seems like the clear winner\n- For en-face imaging of photoreceptor mosaics, is adaptive optics cSLO still superior?\n- What about combined approaches (AO-OCT)?\n\nBudget is limited, so I need to prioritize one system first. Any recommendations on commercial systems that offer good value?",
    type: "question", score: 28, createdAt: weekAgo, updatedAt: weekAgo,
    author: { id: "u3", username: "quantum_optics_phd", displayName: "Aisha Patel" },
    categories: [{ category: { id: "cat8", name: "Biophotonics", slug: "biophotonics", color: "#22c55e" } }, { category: { id: "cat3", name: "Optical Design", slug: "optical-design", color: "#10b981" } }],
    _count: { comments: 0 },
  },
];

export const comments: Record<string, CommentWithDetails[]> = {
  p1: [
    { id: "c1", body: "We had similar issues with our 1.5 kW system. What ultimately worked for us was switching to a water-cooled endcap design with a short negative lens before the collimator. The negative thermal lens of the collimator partially compensates the positive thermal lens of the endcap. Not perfect, but brought the beam quality back to M\u00b2 < 1.3 after hours of operation.", score: 18, createdAt: dayAgo, parentId: null, author: { id: "u4", username: "fiber_guru", displayName: "James O'Brien" } },
  ],
  p2: [
    { id: "c2", body: "Congrats on the results! The 0.9 dB figure is very competitive. A couple questions:\n1. What was your fiber-to-chip angle?\n2. Did you characterize the back-reflection? That's often a deal-breaker for integration with III-V lasers.", score: 12, createdAt: twoDaysAgo, parentId: null, author: { id: "u3", username: "quantum_optics_phd", displayName: "Aisha Patel" } },
    { id: "c3", body: "Thanks! The optimized angle was 12\u00b0 off-vertical. Back-reflection was measured at -25 dB, which could be improved. We're looking at adding a slight tilt to the grating for the next iteration to push it below -30 dB.", score: 8, createdAt: twoDaysAgo, parentId: "c2", author: { id: "u2", username: "photon_wizard", displayName: "Marcus Rivera" } },
  ],
  p3: [
    { id: "c4", body: "For spectral purity with PPLN, we found that going to 2 nm filtering gave us >97% HOM visibility. The tradeoff is lower count rates obviously. Custom poling (especially chirped designs) can help maintain reasonable brightness while improving purity. Check out the group at DTU \u2014 they've published extensively on engineered JSA with PPLN.", score: 15, createdAt: weekAgo, parentId: null, author: { id: "u1", username: "laserphysicist", displayName: "Dr. Sarah Chen" } },
  ],
  p4: [
    { id: "c5", body: "This is fantastic! Safety section is especially important. One additional note: make sure your notch filter is properly angle-tuned. Even a degree off can let through enough Rayleigh scatter to swamp your Raman signal at low wavenumber shifts.", score: 22, createdAt: hourAgo, parentId: null, author: { id: "u2", username: "photon_wizard", displayName: "Marcus Rivera" } },
  ],
  p5: [
    { id: "c6", body: "The efficiency claim does seem high, but keep in mind that at 10.6 \u03bcm, the ratio of antenna size to skin depth is much more favorable than at visible/NIR wavelengths. Ohmic losses scale differently. I'd want to see experimental validation though \u2014 simulation-only papers in this space have a mixed track record.", score: 24, createdAt: twoWeeksAgo, parentId: null, author: { id: "u4", username: "fiber_guru", displayName: "James O'Brien" } },
  ],
  p6: [],
};
