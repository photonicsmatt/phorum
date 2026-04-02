const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const runtime = require("@prisma/client/runtime/client");

// Load the generated config directly
const path = require("path");
const configPath = path.resolve(__dirname, "../src/generated/prisma/internal/class.ts");

// Read and extract config from the generated file
const fs = require("fs");
let source = fs.readFileSync(configPath, "utf-8");

// We need to extract the config object. Instead of trying to parse TS,
// let's use the compiled version that lives in node_modules after generate.
// Actually, let's just use a simpler approach: direct SQL seeding.

const Database = require("better-sqlite3");
const { randomBytes } = require("crypto");

function cuid() {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(8).toString("hex").slice(0, 12);
  return `c${timestamp}${random}`;
}

const db = new Database(path.resolve(__dirname, "..", "dev.db"));

// Enable WAL mode
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

function seed() {
  // Clear existing data
  db.exec("DELETE FROM Vote");
  db.exec("DELETE FROM Comment");
  db.exec("DELETE FROM PostCategory");
  db.exec("DELETE FROM Post");
  db.exec("DELETE FROM Category");
  db.exec("DELETE FROM User");

  // Insert categories
  const insertCat = db.prepare("INSERT INTO Category (id, name, slug, description, color) VALUES (?, ?, ?, ?, ?)");
  const categories = [
    [cuid(), "Laser Systems", "laser-systems", "Discussion about laser design, operation, and applications including solid-state, fiber, gas, and semiconductor lasers.", "#ef4444"],
    [cuid(), "Fiber Optics", "fiber-optics", "Optical fiber technologies, telecommunications, fiber sensors, and fiber-based devices.", "#f59e0b"],
    [cuid(), "Optical Design", "optical-design", "Lens design, optical systems, aberration theory, and ray tracing.", "#10b981"],
    [cuid(), "Quantum Optics", "quantum-optics", "Quantum entanglement, single-photon sources, quantum cryptography, and quantum computing with photons.", "#8b5cf6"],
    [cuid(), "Photonic Integrated Circuits", "photonic-integrated-circuits", "Silicon photonics, PICs, waveguide design, modulators, and on-chip optical interconnects.", "#06b6d4"],
    [cuid(), "Spectroscopy", "spectroscopy", "Raman, FTIR, UV-Vis, fluorescence spectroscopy techniques and instrumentation.", "#ec4899"],
    [cuid(), "Nonlinear Optics", "nonlinear-optics", "Frequency conversion, optical parametric oscillators, Kerr effect, and nonlinear materials.", "#f97316"],
    [cuid(), "Biophotonics", "biophotonics", "Optical imaging in biology, OCT, fluorescence microscopy, and photodynamic therapy.", "#22c55e"],
    [cuid(), "Optical Communications", "optical-communications", "Free-space optical communications, WDM, coherent detection, and optical networking.", "#3b82f6"],
    [cuid(), "Metamaterials & Nanophotonics", "metamaterials-nanophotonics", "Plasmonic structures, photonic crystals, metasurfaces, and nanoscale light manipulation.", "#a855f7"],
  ];
  for (const cat of categories) insertCat.run(...cat);

  // Insert users
  const insertUser = db.prepare("INSERT INTO User (id, username, displayName, bio, createdAt) VALUES (?, ?, ?, ?, datetime('now'))");
  const users = [
    [cuid(), "laserphysicist", "Dr. Sarah Chen", "Laser physicist at Stanford. Working on ultrafast fiber lasers and frequency combs."],
    [cuid(), "photon_wizard", "Marcus Rivera", "Photonic IC designer. Passionate about silicon photonics and co-packaged optics."],
    [cuid(), "quantum_optics_phd", "Aisha Patel", "PhD candidate in quantum optics. Researching entangled photon pair sources."],
    [cuid(), "fiber_guru", "James O'Brien", "20+ years in fiber optic telecommunications. Currently at Corning."],
  ];
  for (const user of users) insertUser.run(...user);

  const now = new Date().toISOString();

  // Insert posts
  const insertPost = db.prepare("INSERT INTO Post (id, title, body, type, score, authorId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  const insertPostCat = db.prepare("INSERT INTO PostCategory (postId, categoryId) VALUES (?, ?)");

  const posts = [
    {
      id: cuid(), title: "Thermal lensing compensation in high-power fiber lasers \u2014 what approaches are you using?",
      body: "I'm working on a 2kW CW fiber laser system and running into significant thermal lensing effects in the delivery optics. The beam quality degrades noticeably after ~30 minutes of operation.\n\nWe've tried:\n- Active cooling of the collimator assembly\n- Using low-absorption fused silica optics\n- Adaptive optics (deformable mirror)\n\nThe deformable mirror approach works best but adds significant cost and complexity. Has anyone had success with simpler passive compensation approaches?\n\nI've read about gradient-index materials that could self-compensate, but haven't found much practical implementation data.\n\nAny references or practical experience would be greatly appreciated!",
      type: "question", score: 42, authorIdx: 0, catIdxs: [0, 1],
    },
    {
      id: cuid(), title: "New results: sub-wavelength grating couplers achieving 0.9 dB insertion loss on SiN platform",
      body: "Our group just published results on a novel sub-wavelength grating (SWG) coupler design for silicon nitride PICs that achieves record-low insertion loss.\n\n## Key Results\n\n- **Insertion loss**: 0.9 dB at 1550 nm (best device), 1.1 dB average across wafer\n- **1-dB bandwidth**: 68 nm\n- **Polarization**: TE mode\n- **Footprint**: 12 \u03bcm \u00d7 15 \u03bcm\n\n## Design Approach\n\nWe used an apodized SWG where the fill factor varies along the coupler length following an optimized polynomial profile. The key insight was co-optimizing the etch depth and SWG period simultaneously using inverse design.\n\nThe fabrication was done at a commercial foundry (IMEC) on their standard SiN platform, so this is immediately manufacturable.\n\nHappy to discuss the design methodology and share simulation files if there's interest!",
      type: "discussion", score: 87, authorIdx: 1, catIdxs: [4],
    },
    {
      id: cuid(), title: "Has anyone characterized Hong-Ou-Mandel interference visibility with PPLN waveguide sources?",
      body: "I'm building a heralded single-photon source using SPDC in a PPLN waveguide, targeting photon pairs at 1550 nm for quantum key distribution experiments.\n\nI'm trying to achieve >95% HOM visibility between photons from two independent sources. Currently getting about 88% and struggling to improve further.\n\nMy suspicion is that spectral distinguishability is the main limitation. I'm using 10 nm bandpass filters for spectral selection, but the joint spectral amplitude might not be pure enough.\n\nQuestions:\n1. What spectral filtering bandwidth have others found optimal for PPLN sources?\n2. Is it worth investing in custom poling profiles for spectrally pure states?\n3. Any recommendations for fiber-coupled narrowband filters at telecom wavelengths?\n\nThanks in advance!",
      type: "question", score: 31, authorIdx: 2, catIdxs: [3, 8],
    },
    {
      id: cuid(), title: "Guide: Setting up a home Raman spectroscopy system on a budget",
      body: "After a year of collecting parts and building, I've assembled a decent Raman spectroscopy setup for under $3,000. Here's how:\n\n## Components\n\n1. **Laser**: 532 nm DPSS laser, 50 mW ($150 from a reputable supplier \u2014 NOT a cheap laser pointer)\n2. **Spectrometer**: Used Ocean Optics USB2000+ from eBay ($600)\n3. **Notch filter**: OD6 532nm notch filter from Thorlabs ($350)\n4. **Collection optics**: Assorted Thorlabs lenses and mounts ($800)\n5. **Probe**: Custom fiber-coupled probe design ($400 in parts)\n6. **Software**: Python + scipy for data analysis (free!)\n\n## Safety First\n**Laser safety is critical.** I have proper OD7+ goggles, an interlocked enclosure, and beam termination. Do NOT skip safety measures.\n\n## Results\nI can reliably identify common minerals, pharmaceuticals (checking supplements), and polymers. The spectral resolution is about 8 cm\u207b\u00b9, which is sufficient for most identification tasks.\n\nFull build guide with CAD files is on my GitHub. Happy to answer questions!",
      type: "discussion", score: 156, authorIdx: 3, catIdxs: [5, 0],
    },
    {
      id: cuid(), title: "Plasmonic metasurface achieving 89% efficiency for beam steering at 10.6 \u03bcm \u2014 breaking the theoretical limit?",
      body: "Just came across a preprint claiming 89% diffraction efficiency for a plasmonic metasurface beam steerer at CO2 laser wavelengths (10.6 \u03bcm). This seems remarkably high for a plasmonic structure.\n\nThe design uses gold nanoantennas on a ZnSe substrate with a geometric phase (Pancharatnam-Berry) approach.\n\nA few things that surprise me:\n- Ohmic losses in gold at MIR wavelengths should be non-negligible\n- They claim sub-wavelength pitch without higher-order diffraction issues\n- The angular range is \u00b160\u00b0 which seems aggressive\n\nHas anyone with metasurface expertise had a chance to evaluate this work? The simulation methodology section is light on details, which always raises flags for me.\n\nNot trying to be unfairly critical \u2014 the results would be genuinely exciting if validated. Just want to discuss with the community.",
      type: "discussion", score: 65, authorIdx: 0, catIdxs: [9],
    },
    {
      id: cuid(), title: "Comparison: OCT vs. confocal microscopy for retinal imaging \u2014 when to use which?",
      body: "I'm a new postdoc setting up an ophthalmic imaging lab and would appreciate the community's practical insights on choosing between OCT and confocal scanning laser ophthalmoscopy (cSLO) for different retinal studies.\n\nI understand the theoretical differences, but I'm looking for practical guidance:\n\n- For longitudinal studies of retinal layer thickness, OCT seems like the clear winner\n- For en-face imaging of photoreceptor mosaics, is adaptive optics cSLO still superior?\n- What about combined approaches (AO-OCT)?\n\nBudget is limited, so I need to prioritize one system first. Any recommendations on commercial systems that offer good value?",
      type: "question", score: 28, authorIdx: 2, catIdxs: [7, 2],
    },
  ];

  for (const post of posts) {
    insertPost.run(post.id, post.title, post.body, post.type, post.score, users[post.authorIdx][0], now, now);
    for (const catIdx of post.catIdxs) {
      insertPostCat.run(post.id, categories[catIdx][0]);
    }
  }

  // Insert comments
  const insertComment = db.prepare("INSERT INTO Comment (id, body, score, authorId, postId, parentId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

  const comment1Id = cuid();
  insertComment.run(comment1Id, "We had similar issues with our 1.5 kW system. What ultimately worked for us was switching to a water-cooled endcap design with a short negative lens before the collimator. The negative thermal lens of the collimator partially compensates the positive thermal lens of the endcap. Not perfect, but brought the beam quality back to M\u00b2 < 1.3 after hours of operation.", 18, users[3][0], posts[0].id, null, now, now);

  const comment2Id = cuid();
  insertComment.run(comment2Id, "Congrats on the results! The 0.9 dB figure is very competitive. A couple questions:\n1. What was your fiber-to-chip angle?\n2. Did you characterize the back-reflection? That's often a deal-breaker for integration with III-V lasers.", 12, users[2][0], posts[1].id, null, now, now);

  insertComment.run(cuid(), "Thanks! The optimized angle was 12\u00b0 off-vertical. Back-reflection was measured at -25 dB, which could be improved. We're looking at adding a slight tilt to the grating for the next iteration to push it below -30 dB.", 8, users[1][0], posts[1].id, comment2Id, now, now);

  insertComment.run(cuid(), "For spectral purity with PPLN, we found that going to 2 nm filtering gave us >97% HOM visibility. The tradeoff is lower count rates obviously. Custom poling (especially chirped designs) can help maintain reasonable brightness while improving purity. Check out the group at DTU \u2014 they've published extensively on engineered JSA with PPLN.", 15, users[0][0], posts[2].id, null, now, now);

  insertComment.run(cuid(), "This is fantastic! Safety section is especially important. One additional note: make sure your notch filter is properly angle-tuned. Even a degree off can let through enough Rayleigh scatter to swamp your Raman signal at low wavenumber shifts.", 22, users[1][0], posts[3].id, null, now, now);

  insertComment.run(cuid(), "The efficiency claim does seem high, but keep in mind that at 10.6 \u03bcm, the ratio of antenna size to skin depth is much more favorable than at visible/NIR wavelengths. Ohmic losses scale differently. I'd want to see experimental validation though \u2014 simulation-only papers in this space have a mixed track record.", 24, users[3][0], posts[4].id, null, now, now);

  console.log("Database seeded successfully!");
  console.log(`Created ${categories.length} categories`);
  console.log(`Created ${users.length} users`);
  console.log(`Created ${posts.length} posts with comments`);
}

seed();
db.close();
