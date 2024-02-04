import React from 'react';
import "./styling_folder/carsList.css";

export default function CarsList(props) {
  const carsArray = props.fitCars || [];
  const sortedCarsArray = [...carsArray].sort((a, b) => {
    const brandComparison = a.selectedBrand.localeCompare(b.selectedBrand);
    if (brandComparison !== 0) {
      return brandComparison;
    } else {
      return a.selectedModel.localeCompare(b.selectedModel);
    }
  });

  const rowSpanValues = [];
  let currentBrand = '';
  let count = 0;

  sortedCarsArray.forEach((car) => {
    if (car.selectedBrand !== currentBrand) {
      currentBrand = car.selectedBrand;
      rowSpanValues.push(1);
      count++;
    } else {
      rowSpanValues[count - 1]++;
    }
  });

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Brand</th>
            <th>Model</th>
            <th>From Year</th>
            <th>To Year</th>
          </tr>
        </thead>
        <tbody>
          {sortedCarsArray.map((car, index) => (
              <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
              {index === 0 || car.selectedBrand !== sortedCarsArray[index - 1].selectedBrand ? (
                <td rowSpan={rowSpanValues.shift()}>{car.selectedBrand}</td>
              ) : null}
              {(car.selectedModel === "") ? (
                <td>All</td>
              ):(
                <td>{car.selectedModel}</td>
              )}
              {(car.selectedFromYear === undefined || car.selectedFromYear === null || car.selectedFromYear === 0) ? ( 
                    <>
                        <td>All</td>
                        <td>All</td>
                    </>
                ) : (
                    <>
                        <td>{car.selectedFromYear}</td>
                        <td>{car.selectedToYear}</td>
                    </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
