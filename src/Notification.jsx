const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className="noti">
      <span>New person was added</span>
    </div>
  );
};

export default Notification;
