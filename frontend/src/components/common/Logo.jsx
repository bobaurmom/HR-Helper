import logo from '../../assets/Logo_HiORing.svg';
import logoLight from '../../assets/Logo_HiORing-light.svg';

function Logo({ light = false, className = 'h-10 w-auto' }) {
  return (
    <img
      src={light ? logoLight : logo}
      alt="HiORing"
      className={`object-contain ${className}`}
      draggable={false}
    />
  );
}

export default Logo;