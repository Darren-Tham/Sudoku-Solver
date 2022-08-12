import { GREEN } from '../Colors'

interface Props {
  width: number;
  time: number;
}

const ProgressBar: React.FC<Props> = ({ width, time }) => {
  const style: React.CSSProperties = {
    backgroundColor: GREEN,
    width: `${width * 100}%`,
    transition: `width ${time}ms linear`,
  }

  return (
    <div className='progress'>
      <div className='bar' style={style}></div>
    </div>
  )
}

export default ProgressBar