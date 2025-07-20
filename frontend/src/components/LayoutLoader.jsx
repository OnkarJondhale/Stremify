import { Skeleton, Paper } from '@mui/material';

function LayoutLoader() {
  return (
    <div className="h-screen w-full flex flex-col">
      <>
        <div className="min-h-12 w-full p-2 flex justify-between items-center relative z-10 border-b border-info">
          <div className="flex items-center gap-2 text-primary p-2">
            <Skeleton variant="circular" width={30} height={30} animation="wave" />
            <Skeleton variant="text" width={100} sx={{ fontSize: '1.5rem' }} animation="wave" />
          </div>

          <div className="hidden sm:flex items-center gap-4 pr-4">
            <Skeleton variant="circular" width={28} height={28} animation="wave" />
            <Skeleton variant="circular" width={28} height={28} animation="wave" />
          </div>
        </div>

        <div className="sm:hidden">
          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, height: '48px' }} elevation={3}>
            <div className="h-full flex justify-around items-center px-2">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <Skeleton variant="circular" width={24} height={24} animation="wave" />
                  <Skeleton variant="text" width={40} sx={{ fontSize: '0.75rem' }} animation="wave" />
                </div>
              ))}
            </div>
          </Paper>
        </div>
      </>


      <div className="flex flex-1 overflow-hidden">
      
        <div
          className="hidden sm:flex flex-col h-full text-primary border-r border-info
                     transition-all duration-300 ease-in-out w-64"
        >

          <div className="flex items-center h-16 border-b border-info justify-end p-2">
            <Skeleton variant="circular" width={32} height={32} animation="wave" />
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex items-center gap-4 p-3 my-1 rounded-lg">
                <Skeleton variant="circular" width={24} height={24} animation="wave" />
                <Skeleton variant="text" width="80%" sx={{ fontSize: '1rem' }} animation="wave" />
              </div>
            ))}
          </div>

          <div className="border-t border-info p-2">
            <div className="flex items-center gap-3 p-2 rounded-lg">
              <Skeleton variant="circular" width={36} height={36} animation="wave" />
              <div className="flex-1">
                <Skeleton variant="text" width="90%" sx={{ fontSize: '0.875rem' }} animation="wave" />
                <Skeleton variant="text" width="60%" sx={{ fontSize: '0.75rem' }} animation="wave" />
              </div>
            </div>
          </div>
        </div>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <Skeleton variant="text" sx={{ fontSize: '2.5rem' }} width="40%" animation="wave" />
          <Skeleton variant="rectangular" height={200} animation="wave" />
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation="wave" />
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation="wave" />
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} width="80%" animation="wave" />
        </main>
      </div>
    </div>
  );
}

export default LayoutLoader;