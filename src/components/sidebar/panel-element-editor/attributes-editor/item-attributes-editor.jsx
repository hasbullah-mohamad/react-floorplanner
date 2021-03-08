import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FormNumberInput from '../../../style/form-number-input';
import FormTextInput from '../../../style/form-text-input';

let tableStyle = {
  width: '100%'
};
let firstTdStyle = {
  width: '6em'
};
let inputStyle = {
  textAlign: 'left'
}

export default function ItemAttributesEditor({element, onUpdate, attributeFormData, state, ...rest}, {translator}) {
  let seats = attributeFormData.has('seats') ? attributeFormData.get('seats') : element.seats;
  let number = attributeFormData.has('number') ? attributeFormData.get('number') : element.number;
  let name = attributeFormData.has('name') ? attributeFormData.get('name') : element.name;
  let renderedX = attributeFormData.has('x') ? attributeFormData.get('x') : element.x;
  let renderedY = attributeFormData.has('y') ? attributeFormData.get('y') : element.y;
  let renderedR = attributeFormData.has('rotation') ? attributeFormData.get('rotation') : element.rotation;
  return <table style={tableStyle}>
    <tbody>
    {
      (element.name === 'Round table' || element.name === 'Table') && (
        <tr>
          <td style={firstTdStyle}>
            {translator.t('Seats')}
          </td>
          <td>
            <FormNumberInput
              value={seats}
              onChange={event => onUpdate('seats', event.target.value)}
              style={inputStyle}
              state={state}
              configs={{precision: 0}}
              {...rest}
            />
          </td>
        </tr>
      )
    }
    {
      (element.name.includes('table') || element.name === 'Table') && (
        <tr>
          <td style={firstTdStyle}>{translator.t('Number')}</td>
          <td>
            <FormTextInput
              value={number}
              onChange={event => onUpdate('number', event.target.value)}
              style={inputStyle}
              state={state}
            />
          </td>
        </tr>
      )
    }
    <tr>
      <td style={firstTdStyle}>{translator.t('Name')}</td>
      <td>
        <FormTextInput
          value={name}
          onChange={event => onUpdate('name', event.target.value)}
          style={inputStyle}
        />
      </td>
    </tr>
    <tr>
      <td style={firstTdStyle}>X</td>
      <td>
        <FormNumberInput
          value={renderedX}
          onChange={event => onUpdate('x', event.target.value)}
          style={inputStyle}
          state={state}
          configs={{precision: 2}}
          {...rest}
        />
      </td>
    </tr>
    <tr>
      <td style={firstTdStyle}>Y</td>
      <td>
        <FormNumberInput
          value={renderedY}
          onChange={event => onUpdate('y', event.target.value)}
          style={inputStyle}
          state={state}
          configs={{precision: 2}}
          {...rest}
        />
      </td>
    </tr>
    <tr>
      <td style={firstTdStyle}>{translator.t('Rotation')}</td>
      <td>
        <FormNumberInput
          value={renderedR}
          onChange={event => onUpdate('rotation', event.target.value)}
          style={inputStyle}
          state={state}
          configs={{precision: 2}}
          {...rest}
        />
      </td>
    </tr>
    </tbody>
  </table>;
}

ItemAttributesEditor.propTypes = {
  element: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  attributeFormData: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired
};

ItemAttributesEditor.contextTypes = {
  translator: PropTypes.object.isRequired,
};
