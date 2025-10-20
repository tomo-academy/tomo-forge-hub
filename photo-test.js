// Quick Photo Test - Run this in browser console
// Test each employee photo URL

const employees = [
  { name: "Kanish SJ", avatar: "/kanish.jpg" },
  { name: "Kamesh AJ", avatar: "/kamesh.jpg" },
  { name: "Aditya Chaurasiya", avatar: "/aditya.jpg" },
  { name: "Kavyashree", avatar: "/Kavyashree.jpg" },
  { name: "Monika", avatar: "/monika.jpg" },
  { name: "Ajay Krithick", avatar: "/ajay.jpg" },
  { name: "Haridharuson L.J", avatar: "/haridharuson.jpg" },
  { name: "Nithish", avatar: "/nithish.jpg" },
  { name: "Dev M K", avatar: "/dev.jpg" },
  { name: "Raaj Nikitaa", avatar: "/rajnikita.jpg" },
  { name: "Nithyasri", avatar: "/nithyasri.jpg" },
  { name: "Indhumathi", avatar: "/indhu.jpg" },
  { name: "Keerthana", avatar: "/placeholder.jpg" },
  { name: "Gowsika", avatar: "/gowsika.jpg" },
  { name: "Chandramathi", avatar: "/Chandramathi.jpg" },
  { name: "Prawin Krishnan", avatar: "/pravin.jpg" }
];

console.log('🔍 Testing all employee photos...');

employees.forEach(employee => {
  const img = new Image();
  img.onload = () => {
    console.log(`✅ ${employee.name}: ${employee.avatar} - LOADED`);
  };
  img.onerror = () => {
    console.log(`❌ ${employee.name}: ${employee.avatar} - FAILED`);
  };
  img.src = employee.avatar;
});

// Also test direct URLs
console.log('📝 Direct URL tests:');
employees.forEach(employee => {
  console.log(`Testing: http://localhost:8080${employee.avatar}`);
});