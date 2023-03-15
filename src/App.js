import { Button, Select, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [template, setTemplate] = useState({});
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/template')
      .then(response => {
        setTemplate(response.data);
        setResponses([createResponse(response.data.choices)]);
      })
      .catch(error => {
        console.log(error);
      });
  }, []); // empty dependency array

  const createResponse = (choices) => {
    const response = {};
    for (const [variable, options] of Object.entries(choices)) {
      response[variable] = '';
    }
    return response;
  };

  const addResponse = () => {
    setResponses([...responses, createResponse(template.choices)]);
  };

  const removeResponse = (index) => {
    setResponses(responses.filter((_, i) => i !== index));
  };

  const handleSelect = (index, variable, value) => {
    setResponses(responses.map((response, i) => {
      if (i === index) {
        return { ...response, [variable]: value };
      }
      return response;
    }));
  };

  const handleSubmit = () => {
    axios.post('http://localhost:8080/response', responses)
      .then(response => {
        console.log(response);
        setResponses([]);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const isSubmitDisabled = () => {
    return responses.some((response) => {
      return Object.values(response).some((value) => value === '');
    });
  };

  function Sentence({ sentence, choices, index }) {
    if (!sentence) return null;

    const dropdowns = Object.entries(choices).map(([variable, options]) => {
      const dropdownOptions = options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ));

      return (
        <Select
          key={variable}
          value={responses[index][variable]}
          onChange={(e) => handleSelect(index, variable, e.target.value)}
        >
          <MenuItem value=''></MenuItem>
          {dropdownOptions}
        </Select>
      );
    });

    const sentenceParts = sentence.split(/\$(\w+)/g);
    const renderedSentence = sentenceParts.map((part, index) => {
      if (index % 2 === 1) {
        const variable = part;
        const dropdown = dropdowns.find((d) => d.key === variable);
        return dropdown || part;
      }
      return part;
    });

    return (
      <div>
        <Button variant="contained" onClick={() => removeResponse(index)}>Remove</Button>
        {renderedSentence}
      </div>
    );
  }

  return (
    <div className="App">
      {responses.map((response, index) => (
        <Sentence
          key={index}
          sentence={template.sentence}
          choices={template.choices}
          index={index}
        />
      ))}
      <Button variant="contained" onClick={addResponse}>Add Response</Button>
      <br />
      <Button variant="contained" onClick={handleSubmit} disabled={isSubmitDisabled()}>
        Submit
      </Button>
    </div>
  );
}

export default App;
