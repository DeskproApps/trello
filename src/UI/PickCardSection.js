import React from 'react';
import PropTypes from 'prop-types';
import { Action, ActionBar, Panel } from '@deskpro/apps-components';

import { Form, Select, required, Group } from '../Forms';
import CardsListComponent from './CardListComponent';
import { listToOption, boardsToOptions, boardToOption } from './utils'

const PickCardSection = ({ onSelectCard, onChange, model, boards, lists, cards, history }) => {
  const onModelChange = (value, key) => {
    let nextModel = null;

    if (key === 'board') {
      const board = boards.filter(board => board.id === value).pop();
      nextModel  = {...model, board };
    } else if (key === 'list') {
      const list = lists.filter(list => list.id === value).pop();
      nextModel  = {...model, list }
    }

    if (nextModel) {
      onChange(key, value, nextModel);
    }
  };

  const onCancel = () => {
    history.push("ticket-loaded", null);
    history.go(1);
  };

  const board = model && model.board ? model.board : boards.length ? boards[0] : null;
  const list = model && model.list ? model.list : lists.length ? lists[0] : null;


  return (
    <Panel className="dp-trello-container">
      <ActionBar title="Pick a card">
        <Action icon="close" onClick={onCancel} />
      </ActionBar>
      <Form name="pick_card" initialValues={{
        board: JSON.stringify(board ? boardToOption('Personal Boards')(board): null),
        list: JSON.stringify(list ? listToOption(list) : null)
      }}>

        <Select
          name=     "board"
          label=    "Board"
          options=  { boardsToOptions(boards, 'Personal Boards') }
          validate= { required }
          onChange= { onModelChange }
        />

        <Select
          name=     "list"
          label=    "List"
          options=  { lists.map(listToOption) }
          validate= { required }
          onChange= { onModelChange }
        />

        <Group label="Cards" >
          <CardsListComponent cards={cards || []} onSelectCard={onSelectCard} showCardLocation={false} showBorder={true} />
        </Group>
      </Form>
    </Panel>
  );
};

PickCardSection.propTypes = {
  model: PropTypes.object,
  cards: PropTypes.array,
  boards: PropTypes.array,
  lists: PropTypes.array,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  onSelectCard: PropTypes.func
};

export default PickCardSection;
