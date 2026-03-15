export default function FloatingOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          top: '10%',
          left: '-5%',
          background: 'radial-gradient(circle, rgba(139,34,82,0.25) 0%, transparent 70%)',
          animation: 'float-orb-1 25s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 250,
          height: 250,
          top: '60%',
          right: '-10%',
          background: 'radial-gradient(circle, rgba(74,26,107,0.3) 0%, transparent 70%)',
          animation: 'float-orb-2 30s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 200,
          height: 200,
          top: '40%',
          left: '50%',
          background: 'radial-gradient(circle, rgba(123,63,160,0.15) 0%, transparent 70%)',
          animation: 'float-orb-3 20s ease-in-out infinite',
        }}
      />
    </div>
  )
}
