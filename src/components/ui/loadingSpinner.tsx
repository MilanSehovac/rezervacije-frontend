import ClipLoader from 'react-spinners/ClipLoader'
const override = {
    display: 'block',
    margin: '100px auto'
}
interface LoadingSpinnerProps {
    loading: boolean;
}
const LoadingSpinner = ({ loading }: LoadingSpinnerProps) => {

  return (
    <>
        <ClipLoader 
        color='#9b7fb8'
        loading={ loading }
        cssOverride={override}
        size={150}
        />
        <div className="font-bold text-6xl text-primary text-center">
            Loading Salons
        </div>
    </>

  )
}

export default LoadingSpinner