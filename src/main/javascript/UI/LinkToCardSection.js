import React from 'react';
import { Container, Heading, Button } from '@deskpro/react-components';

const LinkToCardSection = ({ cards, onCreate, onPick, onSearch }) => {
  return (
    <Container>
      <Heading size={3}>
        {cards.length > 0
          ? 'Link to another card'
          : 'Link to a card'
        }
      </Heading>
      <Button onClick={onSearch}>
        Search for card
      </Button>
      <Button onClick={onPick}>
        Pick card
      </Button>
      <Button onClick={onCreate}>
        Create new card
      </Button>
    </Container>
  );
};

LinkToCardSection.propTypes = {
  cards: React.PropTypes.array.isRequired,
  onCreate: React.PropTypes.func.isRequired,
  onPick: React.PropTypes.func.isRequired,
  onSearch: React.PropTypes.func.isRequired
};
export default LinkToCardSection;
