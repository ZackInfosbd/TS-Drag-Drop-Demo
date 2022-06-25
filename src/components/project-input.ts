import Component from './base-component';
import { AutoBind } from '../decorators/autobind';
import * as Validation from '../utils/validation';
import { projectState } from '../state/project-state';

// ProjectInput Class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');

    this.titleInputElement = this.element.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      '#people'
    ) as HTMLInputElement;
    this.configure();
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  renderContent(): void {}

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatble: Validation.Validatable = {
      value: enteredTitle,
      required: true,
    };

    const descriptionValidatble: Validation.Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };

    const peopleValidatble: Validation.Validatable = {
      value: +enteredPeople,
      required: true,
      min: 2,
      max: 5,
    };

    if (
      !Validation.validate(titleValidatble) ||
      !Validation.validate(descriptionValidatble) ||
      !Validation.validate(peopleValidatble)
    ) {
      alert('Invalid inputs, please try again');
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();

    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clearInputs();
    }
  }
}
