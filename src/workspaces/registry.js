// The instruments (workspaces). `status: "live"` means src/workspaces/<id>.js exists and is wired in main.js;
// "planned" ones show their presets and a note until they are built. The preset counts come from data/presets.json.
export const WORKSPACES = [
  { id: "atlas", title: "Atlas", blurb: "Worked chapters from numbers and algebra to PDEs, each example with a 2D or 3D picture.", group: "Mathematics", phase: 2 },
  { id: "transform", title: "Transform 2D", blurb: "Matrices acting on the plane: rotation, shear, reflection, determinant as area.", group: "Mathematics", phase: 2 },
  { id: "transform3d", title: "Transform 3D", blurb: "3x3 matrices acting on a solid.", group: "Mathematics", phase: 2 },
  { id: "lab", title: "Integrals lab", blurb: "Surfaces, caps and change of variables with the Jacobian.", group: "Mathematics", phase: 2 },
  { id: "revolve", title: "Revolve", blurb: "Solids of revolution by discs and shells.", group: "Mathematics", phase: 2 },
  { id: "double", title: "Double integrals", blurb: "Fubini, order of integration and where it fails.", group: "Mathematics", phase: 2 },
  { id: "arc", title: "Arc length", blurb: "Curve length and parametrisation.", group: "Mathematics", phase: 2 },
  { id: "intersect", title: "Intersect", blurb: "Solids from booleans, such as the Steinmetz solid.", group: "Mathematics", phase: 2 },
  { id: "mechanism", title: "Mechanisms", blurb: "Six degrees of freedom, four-bar linkage, slider-crank, 6R arm.", group: "Engineering", phase: 3 },
  { id: "molecules", title: "Molecules", blurb: "Molecular dynamics, collision theory and the Arrhenius plot.", group: "Science", phase: 3 },
  { id: "deform", title: "Deform", blurb: "Maps (x, y) to (u, v) and their Jacobian; lattice deformation in 3D.", group: "Mathematics", phase: 3 },
  { id: "flow", title: "Flow", blurb: "Smoke, shear layers, cavity flow and the projection step.", group: "Engineering", phase: 3 },
  { id: "solver", title: "Solver", blurb: "ODE phase planes, equations, PDEs and regression.", group: "Engineering", phase: 3 },
  { id: "periodic", title: "Periodic Table Builder", blurb: "Rebuild the periodic table in five historical steps, from Lavoisier to electron shells.", group: "Chemistry", phase: 4, live: true },
];

export const byId = Object.fromEntries(WORKSPACES.map((w) => [w.id, w]));
