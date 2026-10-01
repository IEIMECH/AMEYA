export interface AdminUserRecord {
  id: string;
  username: string;
  salt: string;
  passwordHash: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  avatarColor: string;
}

/**
 * AMEYA '26 Authorized Coordinators
 * Passwords are cryptographically salted and hashed using PBKDF2-SHA512 (100,000 iterations).
 * Zero plaintext credentials exist in source code.
 */
export const ADMIN_USERS: AdminUserRecord[] = [
  {
    id: "admin-1",
    username: "sai.kumar",
    salt: "af3cbf967a8be9b08f5120a4ce9911c3",
    passwordHash: "be393a90f1518ba5fb20ff811c45d01fb942e0245835cf5c1d6ff9b87f4c758a9f4316061b90a382c1fdf56a9a09f281369613d419fdd8041ae8918a78892ea9",
    name: "S. Sai Kumar",
    role: "Lead Administrator",
    phone: "+91 77320 14762",
    email: "sai.kumar@ameyafest.in",
    avatarColor: "#e51d25",
  },
  {
    id: "admin-2",
    username: "sameer.basha",
    salt: "f6da9825dc09bad30b3e8b96c5c6c0d1",
    passwordHash: "1041519a0029b3cafe3038ee0c4c1f11f3d16c83381e3aa2df2ac778e3b20b7f6a5c7de7115dae449c136608aa8dfa5d55e5abf78a97bb49850df7155c52dd30",
    name: "S. Sameer Basha",
    role: "Operations Coordinator",
    phone: "+91 96764 19146",
    email: "sameer.basha@ameyafest.in",
    avatarColor: "#0284c7",
  },
  {
    id: "admin-3",
    username: "jaya.kumar",
    salt: "fddb39f50ac00fcb5ef73c90674e9bfc",
    passwordHash: "3dc01a9306428aeddfa33c9bdb90ec2e50774b9a23e01be636fa243fdb55885914bd01b09f6f3bfeff9f8b2b9071be812e071aff1118696140939ede9ed97811",
    name: "T. Jaya Kumar",
    role: "Events Coordinator",
    phone: "+91 74165 32304",
    email: "jaya.kumar@ameyafest.in",
    avatarColor: "#16a34a",
  },
  {
    id: "admin-4",
    username: "durga.sairam",
    salt: "e22056ea77de62b7a840fafa58868ae0",
    passwordHash: "449a5d09714ac4f962d8483b65eb5ade38f6b12ffeca13aeaa39d5ab5d4e2eb5e68447e557417cd632b5dca9e475bf9cddfcd6e505dca3fd6e4bbeae7542a02e",
    name: "S. Durga Sai Ram",
    role: "Transport & Hospitality Lead",
    phone: "+91 93924 58746",
    email: "durga.sairam@ameyafest.in",
    avatarColor: "#d97706",
  },
];
