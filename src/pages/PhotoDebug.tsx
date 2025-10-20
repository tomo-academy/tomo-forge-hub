// Photo Debug Component - Test all employee photos
import { employees } from '@/data/employees';
import { githubPhotoService } from '@/services/githubPhotoService';

export function PhotoDebugPage() {
  const photoTests = employees.map(employee => {
    const avatarProps = githubPhotoService.getAvatarProps(employee);
    return {
      id: employee.id,
      name: employee.name,
      avatarPath: employee.avatar,
      resolvedUrl: avatarProps.src,
      initials: avatarProps.fallback,
      hasPhoto: avatarProps.hasPhoto
    };
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Photo Debug - All Employees</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photoTests.map((test) => (
          <div key={test.id} className="border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg">{test.name}</h3>
            
            <div className="space-y-2 text-sm">
              <p><strong>Avatar Path:</strong> {test.avatarPath || 'None'}</p>
              <p><strong>Resolved URL:</strong> {test.resolvedUrl || 'None'}</p>
              <p><strong>Has Photo:</strong> {test.hasPhoto ? '✅' : '❌'}</p>
              <p><strong>Initials:</strong> {test.initials}</p>
            </div>

            <div className="flex gap-3">
              {/* Photo Test */}
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Photo Display:</p>
                <div className="w-20 h-20 rounded-lg border overflow-hidden bg-gray-100 flex items-center justify-center">
                  {test.resolvedUrl ? (
                    <img 
                      src={test.resolvedUrl} 
                      alt={test.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(`❌ Failed to load: ${test.resolvedUrl}`);
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling!.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg"
                    style={{ display: test.resolvedUrl ? 'none' : 'flex' }}
                  >
                    {test.initials}
                  </div>
                </div>
              </div>

              {/* Direct URL Test */}
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Direct URL Test:</p>
                <div className="w-20 h-20 rounded-lg border overflow-hidden bg-gray-100">
                  {test.avatarPath && (
                    <img 
                      src={test.avatarPath} 
                      alt={`${test.name} direct`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(`❌ Direct URL failed: ${test.avatarPath}`);
                        e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="%23ff0000"/><text x="40" y="45" text-anchor="middle" fill="white" font-size="12">404</text></svg>';
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <strong>Total Employees:</strong> {photoTests.length}
          </div>
          <div>
            <strong>With Photos:</strong> {photoTests.filter(t => t.hasPhoto).length}
          </div>
          <div>
            <strong>Without Photos:</strong> {photoTests.filter(t => !t.hasPhoto).length}
          </div>
          <div>
            <strong>Missing Files:</strong> {photoTests.filter(t => t.hasPhoto && !t.resolvedUrl).length}
          </div>
        </div>
      </div>
    </div>
  );
}