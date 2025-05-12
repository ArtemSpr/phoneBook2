const Filter = (props) => {
  return (
    <form onSubmit={props.filterName}>
      <div className="filterComp">
        <input
          value={props.nameFilter}
          onChange={props.handleFilterNameChange}
        />
        <button type="submit">Filter</button>
      </div>
    </form>
  );
};

export default Filter;
