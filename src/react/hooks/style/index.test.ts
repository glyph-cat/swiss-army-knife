import { getClassNamesAndStyleContent } from '.'

test(getClassNamesAndStyleContent.name, () => {

  const [classNames, styleContent] = getClassNamesAndStyleContent('main', {
    foo: {
      backgroundColor: 'red',
      fontSize: '12pt',
      height: 48,
    },
    bar: {
      opacity: 0.5,
      ':hover': {
        opacity: 1,
      },
    },
  })

  expect(classNames.foo).toBe('main_foo')
  expect(classNames.bar).toBe('main_bar')
  expect(styleContent).toBe('.main_foo{background-color:red;font-size:12pt;height:48px}.main_bar{opacity:0.5}.main_bar:hover{opacity:1}')

})
