// Debug Component for Browser Console Testing
import { employees } from '@/data/employees';
import { githubPhotoService } from '@/services/githubPhotoService';

// Add this to window for browser console testing
(window as any).photoDebug = {
  employees,
  githubPhotoService,
  testEmployee: (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) {
      console.log(`❌ Employee not found: ${employeeId}`);
      return;
    }
    
    console.log(`🔍 Testing ${employee.name}:`);
    console.log(`  - Avatar field: ${employee.avatar}`);
    console.log(`  - Avatar_url field: ${(employee as any).avatar_url}`);
    
    const photoUrl = githubPhotoService.getEmployeePhotoUrl(employee);
    console.log(`  - Resolved URL: ${photoUrl}`);
    
    const avatarProps = githubPhotoService.getAvatarProps(employee);
    console.log(`  - Avatar props:`, avatarProps);
    
    if (photoUrl) {
      const img = new Image();
      img.onload = () => console.log(`  ✅ Image loads successfully`);
      img.onerror = () => console.log(`  ❌ Image failed to load`);
      img.src = photoUrl;
    }
  },
  testAll: () => {
    console.log('🔍 Testing all employees...');
    employees.forEach(emp => {
      const photoUrl = githubPhotoService.getEmployeePhotoUrl(emp);
      console.log(`${photoUrl ? '📸' : '👤'} ${emp.name}: ${photoUrl || 'No photo - will show initials'}`);
    });
  }
};

console.log('🚀 Photo debug tools loaded! Use:');
console.log('  photoDebug.testAll() - Test all employees');
console.log('  photoDebug.testEmployee("kanish-sj") - Test specific employee');
console.log('  photoDebug.employees - View all employee data');
console.log('  photoDebug.githubPhotoService - Access photo service');