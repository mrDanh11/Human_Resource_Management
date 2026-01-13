export default function PointExchangeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-full" style={{ background: '#fafdff' }}>
        <div className="flex-1 flex flex-col items-center" style={{ background: '#fafdff' }}>
          {children}
        </div>
      </div>
    </>
  );
}
