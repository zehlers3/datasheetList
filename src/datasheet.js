import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './datasheet.css';

const Datasheet = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    projectNumber: '',
    location: '',
    startDate: '',
  });

  const methodOptions = [
    'Carb Method 501', 'CTM-013', 'CTM-013 (IC Analyzer)', 'CTM-027', 'CTM-042',
    'Method 11', 'Method 12', 'Method 13B', 'Method 16A', 'Method 16C',
    'Method 17', 'Method 18', 'Method 2', 'Method 201', 'Method 201A',
    'Method 202', 'Method 22', 'Method 23', 'Method 23PCB', 'Method 25',
    'Method 25A', 'Method 25C', 'Method 26', 'Method 26A', 'Method 26A (IC Analyzer)',
    'Method 29', 'Method 2C', 'Method 2E', 'Method 2G', 'Method 2F',
    'Method 30B', 'Method 30B (Lumex on Site)', 'Method 323', 'Method 4', 'Method 5',
    'Method 5 (PM Lab on Site)', 'Method 5A', 'Method 5B', 'Method 5D', 'Method 5E',
    'Method 204', 'Method 204B', 'Method 204D', 'Method 3A', 'Method 6',
    'Method 8', 'Method 8A', 'Method 9', 'OTM 45 PFSA', 'SW-846 0010',
    'SW-846 0030', 'SW-846 0061', 'TO-15', '(ALT-001)', '(ALT-010)', '(ALT-043)',
  ];

  const initialMethodsState = methodOptions.map((method) => ({
    method,
    runs: '',
    testLocations: '',
  }));

  const [methods, setMethods] = useState(initialMethodsState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMethodChange = (e, index, field) => {
    const updatedMethods = methods.map((method, i) => {
      if (i === index) {
        return { ...method, [field]: e.target.value };
      }
      return method;
    });
    setMethods(updatedMethods);
  };

  const submitForm = () => {
    const filteredMethods = methods.filter(method => method.runs || method.testLocations);
    const workbook = XLSX.utils.book_new();
    const sheetData = [
      ['Client Name', formData.clientName],
      ['Project Number', formData.projectNumber],
      ['Location', formData.location],
      ['Start Date', formData.startDate],
      ...filteredMethods.map((method) => [
        method.method, method.runs, method.testLocations
      ])
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'datasheet.xlsx');
  };

  return (
    <div className="form-container">
      <h2>Datasheet Input Form</h2>
      <form>
        <div className="label-group">
          <div>
            <label htmlFor="clientName">Client Name:</label><br />
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="projectNumber">Project Number:</label><br />
            <input
              type="text"
              id="projectNumber"
              name="projectNumber"
              value={formData.projectNumber}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="location">Location:</label><br />
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="startDate">Start Date:</label><br />
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
            />
          </div>
        </div>
  
        <div id="methods">
          {methods.map((method, index) => (
            <div className="method-group" key={index}>
              <label>{method.method}</label>
              <input
                type="number"
                name="runs"
                placeholder="Number of runs"
                value={method.runs}
                onChange={(e) => handleMethodChange(e, index, 'runs')}
              />
              <input
                type="number"
                name="testLocations"
                placeholder="Number of test locations"
                value={method.testLocations}
                onChange={(e) => handleMethodChange(e, index, 'testLocations')}
              />
            </div>
          ))}
        </div>

        <button type="button" onClick={submitForm} className="submit-btn">Create Datasheet</button>
      </form>
    </div>
  );
};

export default Datasheet;
