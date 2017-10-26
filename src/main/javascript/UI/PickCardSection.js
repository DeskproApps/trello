import React from 'react';
import { Form, Select, Button, validators } from '@deskpro/react-components/lib/bindings/redux-form';
import { Container, Section, Heading } from '@deskpro/react-components';
import { boardsToOptions, listsToOptions } from '../utils/forms';
import CardsListComponent from './CardListComponent';

const PickCardSection = ({ onSelectCard, onGotoCard, onCancel, onSubmit, onChange, boards, lists, cards, ...otherProps }) => {
  return (
    <Container {...otherProps}>
      <Heading size={3}>
        Pick an existing card
      </Heading>
      <Form name="pick" onSubmit={onSubmit}>
        <Select
          label="Board:"
          id="board"
          name="board"
          validate={validators.required}
          options={boardsToOptions(boards)}
          onChange={onChange}
        />
        <Select
          label="List:"
          id="list"
          name="list"
          validate={validators.required}
          options={listsToOptions(lists)}
          onChange={onChange}
        />
        <Section title="Cards">
          <CardsListComponent
            cards={cards || []}
            onGotoCard={onGotoCard}
            onSelectCard={onSelectCard}
            showCardLocation={false}
            showBorder={true}
          />
        </Section>
      </Form>
      <Button onClick={(e) => { e.preventDefault(); onCancel(e); }}>
        Cancel
      </Button>
    </Container>
  );
};

PickCardSection.propTypes = {
  cards: React.PropTypes.array,
  boards: React.PropTypes.array,
  lists: React.PropTypes.array,
  onCancel: React.PropTypes.func,
  onSubmit: React.PropTypes.func,
  onChange: React.PropTypes.func,
  onSelectCard: React.PropTypes.func,
  onGotoCard: React.PropTypes.func
};

export default PickCardSection;
