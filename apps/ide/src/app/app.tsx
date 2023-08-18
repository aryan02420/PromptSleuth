import styled from '@emotion/styled';
import { useGlobalState } from '@/app/state.ts';
import { TagEntity } from '@promptsleuth/core';
import { UiComponents, Button } from '@promptsleuth/ui-components/components';
import '@promptsleuth/ui-components/lib/globals.css';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  const { state } = useGlobalState();
  return (
    <StyledApp>
      <UiComponents />
      <h1>PromptSleuth IDE</h1>
      {state.prompts.map((prompt, index) => (
        <div key={prompt.id}>
          <h2>Prompt</h2>
          <Button onClick={() => state.removePrompt(index)} variant={'destructive'} size={'sm'} >Remove Prompt</Button>
          <h3>Messages</h3>
          {prompt.messages.map((message, index) => (
            <div key={message.id}>
              <select name="role" id="role" onChange={(evt) => {
                // @ts-expect-error evt.target.value is inferred as string
                message.role = evt.target.value
              }} defaultValue={message.role}>
              {message.availableRoles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
              </select>
              <textarea name={message.id} id={message.id} cols={30} rows={10} defaultValue={message.content} onChange={(evt) => message.content = evt.target.value}></textarea>
              <button onClick={() => prompt.removeMessage(index)}>Remove Message</button>
            </div>
          ))}
          <button onClick={() => prompt.addMessage()}>Add Message</button>
          <h3>Model</h3>
          <select name="model" id="model" onChange={(evt) => {
            const model = prompt.getModel(evt.target.value);
            if (model) prompt.model = model;
          }} defaultValue={prompt.model.name}>
            {prompt.availableModels.map((model) => (
              <option key={model.id} value={model.name}>{model.name}</option>
            ))}
          </select>
          <h3>Parameters</h3>
          {prompt.model.params.map((param) => (
            <div key={param.id}>
              <label htmlFor={param.id}>{param.name}</label>
              <input type="range" name={param.name} id={param.id} min={param.min} max={param.max} step={param.step} defaultValue={param.value} onChange={evt => param.value = +evt.target.value}/>
              <span>{param.value}</span>
            </div>
          ))}
          <h3>Tags</h3>
          {Array.from(prompt.tags).map((tag) => (
            <div key={tag.id}>
              <span>{tag.toString()}</span>
              <button onClick={() => prompt.removeTag(tag)}>Remove</button>
            </div>
          ))}
          <select name="tag" id="tag" onChange={(evt) => {
            const tag = state.promptTagManager.getTag(+evt.target.value);
            if (tag) prompt.addTag(tag);
            evt.target.value = "";
          }}>
            <option value="" disabled selected>Add tag</option>
            {state.promptTagManager.availableTags.map(
              (tag, index) => {
                if (prompt.hasTag(tag.id)) return null;
                return <option key={index} value={index}>{tag.toString()}</option>;
              }
            )}
          </select>
        </div>
      ))}
      <button onClick={() => state.addPrompt()}>Add Prompt</button>
      <h2>Tags</h2>
      {state.promptTagManager.availableTags.map((tag, index) => (
        <div key={tag.id}>
          <span>{tag.toString()}</span>
          <button onClick={() => state.promptTagManager.removeTag(index)}>Remove</button>
        </div>
      ))}
      <input type="text" name="tag" id="tag" />
      <button onClick={() => state.promptTagManager.addTag(new TagEntity("Foo", "Bar", "description", "Neutral"))}>Add Tag</button>
    </StyledApp>
  );
}

export default App;
