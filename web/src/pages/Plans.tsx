export function Plans() {
  return (
    <div className="page">
      <h2 className="heading">All Plans</h2>
      
      <div className="table-container">
        <table className="table">
          <thead className="table__head">
            <tr>
              <th className="table__header">Title</th>
              <th className="table__header">Location</th>
              <th className="table__header">Budget</th>
              <th className="table__header">Date</th>
            </tr>
          </thead>
          <tbody className="table__body">
            <tr className="table__row">
              <td colSpan={4} className="table__cell table__cell--center">
                No plans yet
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
