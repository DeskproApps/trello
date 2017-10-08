import React from 'react';
import { Container, Section, Heading, Button } from '@deskpro/react-components';
import CardsListComponent from './CardListComponent';
import SearchInputComponent from './SearchInputComponent';

const SearchCardSection = ({ onSelectCard, onGotoCard, onCancel, onSearchChange, cards, ...otherProps }) => {

  let searchInput;
  const onChange = value => { searchInput = value; };
  const onSearchButtonClick = () => {
    if (searchInput) {
      onSearchChange(searchInput);
    }
  };

  return (
    <Container {...otherProps}>
      <Heading size={3}>
        Search for a card
      </Heading>
      <Section>
        <SearchInputComponent
          fluid
          placeholder="Search card or paste URL..."
          minCharacters={3}
          onSearch={onSearchChange}
          onChange={onChange}
        />
      </Section>
      <Section>
        <CardsListComponent
          cards={cards || []}
          onSelectCard={onSelectCard}
          onGotoCard={onGotoCard}
          showBorder={true}
        />
      </Section>
      <Section>
        <Button onClick={onSearchButtonClick}>
          Search
        </Button>
        <Button onClick={(e) => { e.preventDefault(); onCancel(e); }}>
          Cancel
        </Button>
      </Section>
    </Container>
  );
};

SearchCardSection.propTypes = {
  cards: React.PropTypes.array,
  onCancel: React.PropTypes.func,
  onSearchChange: React.PropTypes.func,
  onSelectCard: React.PropTypes.func,
  onGotoCard: React.PropTypes.func
};

export default SearchCardSection;
