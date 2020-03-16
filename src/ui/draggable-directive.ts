import {DirectiveOptions} from 'vue';

const draggable: DirectiveOptions = {
  bind:  (el, binding) => {

    // Init
    const marginX = binding.value.marginX;
    const marginY = binding.value.marginY;
    const configStr = localStorage.getItem(`draggable@${binding.value.key}`);
    if (configStr) {
      const config = JSON.parse(configStr);
      const top = Number(config.top.substr(0, config.top.length - 2));
      const left = Number(config.left.substr(0, config.left.length - 2));
      el.style.top = limit(top, marginY, document.documentElement.clientHeight - el.offsetHeight - marginY) + 'px';
      el.style.left = limit(left, marginX, document.documentElement.clientWidth - el.offsetWidth - marginX) + 'px';
    } else if (binding.value) {
      el.style.left = binding.value.left + 'px';
      el.style.top = binding.value.top + 'px';
    }
    
    // Add Resize Event Listener
    addEventListener('resize', () => {
      const top = Number(el.style.top .substr(0, el.style.top.length - 2));
      const left = Number(el.style.left.substr(0, el.style.left.length - 2));
      el.style.top = limit(top, marginY, document.documentElement.clientHeight - el.offsetHeight - marginY) + 'px';
      el.style.left = limit(left, marginX, document.documentElement.clientWidth - el.offsetWidth - marginX) + 'px';
    });

    // On PC
    el.onmousedown = e => {
      e.preventDefault();
      //计算鼠标相对元素的位置
      const disX = e.clientX - el.offsetLeft;
      const disY = e.clientY - el.offsetTop;
      const cursor = el.style.cursor;
      el.style.cursor = 'move';
      function onmousemove(e: MouseEvent) {
        // callback
        binding.value.moveCallback();
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置2
        const top = e.clientY - disY;
        const left = e.clientX - disX;
        //移动当前元素
        moveTo(top, left);
      }
      function onmouseup() {
        el.style.cursor = cursor;
        document.removeEventListener('mousemove', onmousemove);
        document.removeEventListener('mouseup', onmouseup);
        savePosition();
      }
      document.addEventListener('mousemove',  onmousemove, {passive: false});
      document.addEventListener('mouseup',  onmouseup);
    };

    // On Mobile
    el.ontouchstart = e => {
      //计算第一个触摸点相对元素的位置
      let disX = e.touches[0].clientX - el.offsetLeft;
      let disY = e.touches[0].clientY - el.offsetTop;
      function ontouchmove(e: TouchEvent) {
        e.preventDefault();
        // callback
        binding.value.moveCallback();
        //用触摸点的位置减去触摸点相对元素的位置，得到元素的位置2
        let top = e.touches[0].clientY - disY;
        let left = e.touches[0].clientX - disX;
        //移动当前元素
        moveTo(top, left);
      }
      function ontouchend() {
        document.removeEventListener('touchmove', ontouchmove);
        document.removeEventListener('touchend', ontouchend);
        savePosition();
      }
      document.addEventListener('touchmove',  ontouchmove, {passive: false});
      document.addEventListener('touchend',  ontouchend);
    };
    
    // Utils
    function savePosition() {
      localStorage.setItem(`draggable@${binding.value.key}`, JSON.stringify({
        top: el.style.top,
        left: el.style.left,
      }));
    }
    function moveTo(top: number, left: number) {
      el.style.top = limit(top, marginY, document.documentElement.clientHeight - el.offsetHeight - marginY) + 'px';
      el.style.left = limit(left, marginX, document.documentElement.clientWidth - el.offsetWidth - marginX) + 'px';
      el.style.right = 'unset';
      el.style.bottom = 'unset';
    }
    function limit(value: number, min: number, max: number): number {
      value = Math.min(value, max);
      value = Math.max(value, min);
      return value;
    }
  }
};

export default draggable;
