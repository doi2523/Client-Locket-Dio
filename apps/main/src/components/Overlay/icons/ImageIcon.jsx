const ImageIcon = ({ data }) => {
  return (
    <img
      src={data}
      alt="icon"
      className="w-6 h-6 object-contain"
    />
  );
};

export default ImageIcon;