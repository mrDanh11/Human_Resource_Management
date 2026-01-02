export default function PointExchangeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex" style={{ background: '#fafdff' }}>
        <div className="flex-1 flex flex-col items-center pt-2" style={{ background: '#fafdff' }}>
          {children}
        </div>
      </div>
    </>
  );
}
