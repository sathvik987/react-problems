export interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
}

/**
 * A plain module-level array — the "database". Nothing here changes at
 * runtime, which is exactly why it's worth noticing if it ever does.
 * The order below is insertion order (oldest hire first).
 */
export const EMPLOYEES: Employee[] = [
  { id: 1, name: "Ada Okafor", role: "Staff Engineer", department: "Platform" },
  { id: 2, name: "Priya Raman", role: "Designer", department: "Product" },
  { id: 3, name: "Luis Ferreira", role: "Engineer", department: "Platform" },
  { id: 4, name: "Mei Tanaka", role: "Engineering Manager", department: "Infra" },
  { id: 5, name: "Tomas Novak", role: "Analyst", department: "Finance" },
  { id: 6, name: "Zoe Bennett", role: "Engineer", department: "Product" },
  { id: 7, name: "Omar Haddad", role: "Recruiter", department: "People" },
  { id: 8, name: "Hana Kovac", role: "Designer", department: "Infra" },
];
