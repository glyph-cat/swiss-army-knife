## Design Choice

It is easier to visually grasp the hierarchy/boundary like this:
```tsx
<View.Relative>
  <View.Absolute>
    <>some children</>
  </View.Absolute>
</View.Relative>
```

than this:
```tsx
<View relative>
  <View absolute>
    <>some children</>
  </View>
</View>
```
