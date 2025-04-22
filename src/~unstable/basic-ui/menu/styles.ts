import {
  addStyles,
  clientOnly,
  PrecedenceLevel,
  StyleMap,
  ThemeToken,
} from '@glyph-cat/swiss-army-knife'
import { prefixBasicUIIdentifiers } from '../_internals/prefixing'

export const styles = prefixBasicUIIdentifiers('menu', [
  'ul',
  'scrollerContainer',
])

clientOnly(() => {
  addStyles(new StyleMap([
    [`.${styles.ul}`, {
      backgroundColor: ThemeToken.appBgColor,
      backgroundImage: 'linear-gradient(#80808020, #80808020)',
      border: 'solid 1px #80808060',
      borderRadius: ThemeToken.spacingS,
      boxShadow: '0px 5px 10px 0px #00000040',
      display: 'grid',
      listStyle: 'none',
      margin: 0,
      minWidth: 200,
      overflow: 'hidden',
      paddingInline: ThemeToken.spacingS,
      userSelect: 'none',
    }],
    [`.${styles.ul} > li[data-type="scroller"]`, {
      minHeight: ThemeToken.spacingS,
    }],
    [`.${styles.scrollerContainer}`, {
      height: 12,
      placeItems: 'center',
    }],
    [`.${styles.ul} > li[data-type="item"]`, {
      alignItems: 'center',
      borderRadius: ThemeToken.spacingS,
      display: 'grid',
      fontSize: '10pt',
      height: 32,
      paddingInline: ThemeToken.spacingM,
    }],
    [`.${styles.ul} > li[data-type="item"]:not([data-enabled="true"])`, {
      cursor: ThemeToken.interactiveDisabledCursor,
    }],
    [`.${styles.ul} > li[data-type="item"]:not([data-enabled="true"]) > div`, {
      opacity: 0.5,
    }],
    [`.${styles.ul} > li[data-type="item"][data-enabled="true"]`, {
      cursor: ThemeToken.interactiveEnabledCursor,
    }],
    [`.${styles.ul} > li[data-type="item"][data-enabled="true"]:hover`, {
      backgroundColor: ThemeToken.primaryColor40,
      color: ThemeToken.appTextColorStrong,
    }],
    [`.${styles.ul}:active > li[data-type="item"][data-enabled="true"]:hover`, {
      backgroundColor: ThemeToken.primaryColor,
    }],
    [`.${styles.ul} > li[data-type="separator"]`, {
      backgroundColor: '#80808040',
      height: 1,
      margin: `${ThemeToken.spacingS}`,
    }],
  ]).compile(), PrecedenceLevel.INTERNAL)
})
