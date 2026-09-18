import logo from '../../assets/Logo_HiORing.png';

function Logo() {
  return (
    <img
      src={logo}
      alt="HiORing"
      className="h-10 w-auto object-contain"
      draggable={false}
    />
  );
}

export default Logo;