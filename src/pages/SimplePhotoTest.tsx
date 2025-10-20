// Simple Photo Test Page
import { employees } from '@/data/employees';
import { githubPhotoService } from '@/services/githubPhotoService';

export default function SimplePhotoTest() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Simple Photo Test</h1>
      
      <div className="grid grid-cols-4 gap-4">
        {employees.slice(0, 8).map((employee) => {
          const photoUrl = githubPhotoService.getEmployeePhotoUrl(employee);
          const initials = githubPhotoService.getEmployeeInitials(employee.name);
          
          return (
            <div key={employee.id} className="border p-4 text-center">
              <div className="w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {photoUrl ? (
                  <img 
                    src={photoUrl} 
                    alt={employee.name}
                    className="w-full h-full object-cover"
                    onLoad={() => console.log(`✅ Loaded: ${employee.name} - ${photoUrl}`)}
                    onError={(e) => {
                      console.log(`❌ Failed: ${employee.name} - ${photoUrl}`);
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling!.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold"
                  style={{ display: photoUrl ? 'none' : 'flex' }}
                >
                  {initials}
                </div>
              </div>
              <p className="font-medium">{employee.name}</p>
              <p className="text-xs text-gray-500">{employee.avatar}</p>
              <p className="text-xs text-green-600">{photoUrl}</p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Direct Image Tests</h2>
        <div className="grid grid-cols-8 gap-2">
          {[
            '/kanish.jpg', '/kamesh.jpg', '/aditya.jpg', '/Kavyashree.jpg',
            '/monika.jpg', '/ajay.jpg', '/nithish.jpg', '/dev.jpg'
          ].map(src => (
            <div key={src} className="text-center">
              <img 
                src={src} 
                alt={src}
                className="w-16 h-16 object-cover rounded border"
                onLoad={() => console.log(`✅ Direct load: ${src}`)}
                onError={() => console.log(`❌ Direct fail: ${src}`)}
              />
              <p className="text-xs mt-1">{src}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}