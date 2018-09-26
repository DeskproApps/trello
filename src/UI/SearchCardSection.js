import React from 'react';
import PropTypes from 'prop-types';

import { Action, ActionBar, Button, Panel } from '@deskpro/apps-components';

import CardsListComponent from './CardListComponent';
import SearchInputComponent from './SearchInputComponent';

const SearchCardSection = ({ onSelectCard, onSearchChange, cards, history }) => {

  let searchInput;
  const onChange = value => { searchInput = value; };
  const onCancel = () => {
    history.push("ticket-loaded", null);
    history.go(1);
  };

  const onSearchButtonClick = () => { if (searchInput) { onSearchChange(searchInput); };  };

  return (
    <Panel title={"Search for card"}>
      <ActionBar title="Create card">
        <Action icon="close" onClick={onCancel} />
      </ActionBar>
      <div className="dp-form-group">
        <SearchInputComponent
          placeholder   ="Enter text or paste URL..."
          minCharacters ={3}
          onSearch      ={onSearchChange}
          onChange      ={onChange}
        />
      </div>

      <CardsListComponent cards={cards || []} onSelectCard={onSelectCard} showBorder={true} />

      <div className="dp-form-group dp-form-controls">
        <Button onClick={onSearchButtonClick} className={"dp-form-control dp-Button--wide"}>Search</Button>
        <Button type="secondary" onClick={onCancel} className={"dp-form-control dp-Button--wide"}>Cancel</Button>
      </div>
    </Panel>
  );
};


SearchCardSection.propTypes = {
  cards: PropTypes.array,
  onSearchChange: PropTypes.func,
  onSelectCard: PropTypes.func,
};

export default SearchCardSection;
