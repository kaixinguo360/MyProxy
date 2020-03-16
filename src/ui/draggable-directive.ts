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
    addEventListener('resize', () => {
      const top = Number(el.style.top .substr(0, el.style.top.length - 2));
      const left = Number(el.style.left.substr(0, el.style.left.length - 2));
      el.style.top = limit(top, marginY, document.documentElement.clientHeight - el.offsetHeight - marginY) + 'px';
      el.style.left = limit(left, marginX, document.documentElement.clientWidth - el.offsetWidth - marginX) + 'px';
    });

    // PC
    el.onmousedown = e => {
      e.preventDefault();
      //计算鼠标相对元素的位置
      let disX = e.clientX - el.offsetLeft;
      let disY = e.clientY - el.offsetTop;
      document.onmousemove = e => {
        // move callback
        binding.value.moveCallback();
        el.style.cursor='move';
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置2
        let top = e.clientY - disY;
        let left = e.clientX - disX;
        //移动当前元素
        moveTo(top, left);
      };
      document.onmouseup = moveFinish;
    };

    // Mobile
    el.ontouchstart = e => {
      //计算第一个触摸点相对元素的位置
      let disX = e.touches[0].clientX - el.offsetLeft;
      let disY = e.touches[0].clientY - el.offsetTop;
      document.ontouchmove = e => {
        e.preventDefault();
        // move callback
        binding.value.moveCallback();
        el.style.cursor='move';
        //用触摸点的位置减去触摸点相对元素的位置，得到元素的位置2
        let top = e.touches[0].clientY - disY;
        let left = e.touches[0].clientX - disX;
        //移动当前元素
        moveTo(top, left);
      };
      document.ontouchend = moveFinish;
    };
    
    // Utils
    function moveFinish() {
      el.style.cursor='unset';
      document.onmousemove = null;
      document.onmouseup = null;
      document.ontouchmove = null;
      document.ontouchend = null;
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
