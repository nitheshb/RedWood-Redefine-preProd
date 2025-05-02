import './CircleBar.css'
import PieChartCRMCore from './PieChartCore'

const CircleBar = () => {
  return (
    <div
      style={{
        width: '14rem',
        height: '12rem',
        position: 'relative',
        backgroundColor: 'white',
      }}
    >
      <div>
        <PieChartCRMCore pieVal={20} />
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '39%',
            fontSize: '2rem',
            fontWeight: '600',
            color: '#0077B6',
          }}
        >
          {20}%
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: '80%',
          left: '40%',
          padding: '0 0.5rem',
          fontSize: '0.9rem',
          color: '#4fa183',
          textAlign: 'center',
        }}
        className="bg-[#57c0d0] text-center"
      >
        <span className="text-white">Sale</span>
      </div>
    </div>
  )
}

export default CircleBar
