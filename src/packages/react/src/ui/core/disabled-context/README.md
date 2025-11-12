## Problems This Aims To Solve
Consider the scenarios below:

### Scenario 1
- Semi-hard coded and repetitive components.
- For every component, a `disabled` prop needs to be passed.

```jsx
const [isBusy, setBusyState] = useState(false)
return (
  <div>
    <input disabled={isBusy} />
    <input disabled={isBusy} />
    <button disabled={isBusy} />
  </div>
)
```

### Scenario 2
- This solves Scenario 1 but only if the form controls are stored in an iterable object.
- If there is a variety of input components, this adds complexity by introducing conditional rendering.

```jsx
const [isBusy, setBusyState] = useState(false)
return (
  <div>
    {controls.map((control) => {
      return (
        <input
          value={control.value}
          onChange={control.onChange}
          disabled={control.disabled}
        />
      )
    })}
  </div>
)
```

### Scenario 3
- This `fieldset` element solves the problem of Scenarios 1 and 2, but is only applicable in HTML.
- What happens when this is needed in other React Native or other custom/niche React-based platforms?

```jsx
const [isBusy, setBusyState] = useState(false)
return (
  <form>
    <fieldset disabled={isBusy}>
      <input />
      <input />
      <button />
    </fieldset>
  </form>
)
```

## The Solution
- `DisabledContext` is non-platform specific and written purely in TypeScript.
- Its disabled state can also be shared with custom components through the `useDisabledContext` hook.
