import React from "react";
import { Form, Input, Textarea, Select, Datepicker, TagSet, Button, validators } from '@deskpro/react-components/lib/bindings/redux-form';
import { Container, Section, Heading, HiddenFields } from '@deskpro/react-components';
import { boardsToOptions, listsToOptions } from '../utils/forms';
import TrelloBoard from '../Trello/TrelloBoard';

const createNewListOption = {
  value: 'trello.newList',
  label: '--- CREATE LIST ---'
};

class CreateCardSection extends React.Component {
  static propTypes = {
    onCancel: React.PropTypes.func,
    onSubmit: React.PropTypes.func,
    onChange: React.PropTypes.func,
    boards: React.PropTypes.array,
    lists: React.PropTypes.array
  };

  static defaultProps = {
    boards: [],
    lists: []
  };

  constructor(props) {
    super(props);
    this.state = {
      showCreateList: false
    };
  }

  handleSubmit = (values) => {
    if (!this.state.showCreateList) {
      values.newList = null;
    }
    this.props.onSubmit(values);
  };

  handleChange = (value, key) => {
    let internalEvent = false;
    let showCreateList = null;
    if (key === 'list') {
      showCreateList = value === createNewListOption.value;
      internalEvent = showCreateList;
    } else if (key === 'board') {
      showCreateList = false;
    }

    if (showCreateList !== null) {
      this.setState({ showCreateList });
    }
    if (!internalEvent) {
      this.props.onChange(value, key);
    }
  };

  render () {
    const { boards, lists, onCancel } = this.props;

    return (
      <Container>
        <Heading size={3}>
          Create a new card
        </Heading>
        <Form name="create" onSubmit={this.handleSubmit}>
          <Select
            label="Board:"
            id="board"
            name="board"
            validate={validators.required}
            options={boardsToOptions(boards)}
            onChange={this.handleChange}
          />
          <Select
            label="List:"
            id="list"
            name="list"
            options={[{ ...createNewListOption}].concat(listsToOptions(lists))}
            onChange={this.handleChange}
          />
          <Section hidden={!this.state.showCreateList}>
            <Input
              label="List Name:"
              id="newList"
              name="newList"
            />
          </Section>
          <Input
            label="Title"
            id="title"
            name="title"
            validate={validators.required}
          />
          <Textarea
            label="Description"
            id="description"
            name="description"
            validate={validators.required}
          />
          <HiddenFields labelShow="Show 2 optional fields" labelHide="Hide optional fields">
            <Datepicker
              label="Due Date:"
              id="duedate"
              name="duedate"
            />
            <TagSet
              label="Labels:"
              id="labels"
              name="labels"
              tags={[]}
              options={[]}
            />
          </HiddenFields>
          <Section>
            <Button>
              Create Card
            </Button>
            <Button onClick={(e) => { e.preventDefault(); onCancel(e); }}>
              Cancel
            </Button>
          </Section>
        </Form>
      </Container>
    );
  }
}

export default CreateCardSection;
