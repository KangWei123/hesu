export function setTransform(top, left, width, height, scale = 1) {
  // Replace unitless items with px
  const translate = `translate3d(${left * scale}px, ${top * scale}px, 0) scale(${scale})`;
  return {
    transform: translate,
    WebkitTransform: translate,
    MozTransform: translate,
    msTransform: translate,
    OTransform: translate,
    width: width + 'px',
    height: height + 'px',
    position: 'absolute'
  };
}

export function setTopLeft(top, left, width, height, scale = 1) {
  const translate = `scale(${scale})`;
  return {
    top: top * scale + 'px',
    left: left * scale + 'px',
    width: width + 'px',
    height: height + 'px',
    position: 'absolute',
    transform: translate,
    WebkitTransform: translate,
    MozTransform: translate,
    msTransform: translate,
    OTransform: translate
  };
}

export function setTransform_rem(top, left, width, height, scale = 1) {
  // Replace unitless items with px
  const translate = `translate3d(${left / scale}rem, ${top / scale}rem, 0)`;
  return {
    transform: translate,
    WebkitTransform: translate,
    MozTransform: translate,
    msTransform: translate,
    OTransform: translate,
    width: width / scale + 'rem',
    height: height / scale + 'rem',
    position: 'absolute'
  };
}

export function setTopLeft_rem(top, left, width, height, scale = 1) {
  return {
    top: top / scale + 'rem',
    left: left / scale + 'rem',
    width: width / scale + 'rem',
    height: height / scale + 'rem',
    position: 'absolute'
  };
}
