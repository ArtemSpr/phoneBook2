const CardItem = (props) => {
  return (
    <div className="cardItem">
      <div className="cardTitle">
        <h2>{props.title}</h2>
      </div>
      <div className="cardContext">{props.content}</div>
    </div>
  );
};

export default CardItem;
