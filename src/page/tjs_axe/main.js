import * as THREE from 'three';
import {
	CSS2DRenderer,
	CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer.js';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import html2canvas from 'html2canvas';

import {
	BaseLine
} from './BaseLine.js';

let cameraPersp, cameraOrtho, currentCamera,AxeTarget;
let scene, renderer, control, labelRenderer, loadedFont;

let layer2dImage = new Image();
let layerMainImage = new Image();
let renderSize = {x:512,y:512};
let DateTime = new Date();
let DowonloadLink = document.createElement("a"); // 创建一个a标签

let finalCanvas,finalViewCtx;

// 更新最终贴图时的顺序，为0时说明更新完毕
let UpdateProcess = 0;
let IsCheckUpdate = false;

let h2cSetting={
		scale: 1, // 数值越大生成的图片越清晰
		useCORS: true,
		allowTaint: true,
		y: 0, // 滚动条高度修复
		x: 0,
		allowTaint: true, //开启跨域
		useCORS: true,
		scrollX: 0,
		scrollY: 0, // 关键代码
		height: renderSize.y, // 加高度，避免截取不全
		//backgroundColor: null // 保证获取的图片是透明的
		backgroundColor: 'white' // 保证获取的图片是白底的
};

function create() {
	AxeTarget = new BaseLine();
	scene.add(AxeTarget);

	AxeTarget.scale.set(-1, 1, -1);
}

function init() {

	const aspect = 1;
	let orthoWidth = 0.4;

	cameraPersp = new THREE.PerspectiveCamera(60, aspect, 0.01, 30000);
	cameraOrtho = new THREE.OrthographicCamera(-orthoWidth * aspect, orthoWidth * aspect, orthoWidth, -orthoWidth, 0.01,
		30000);
	cameraOrtho.zoom = 1.2;
	currentCamera = cameraPersp;

	currentCamera.position.z = 5;

	currentCamera.updateProjectionMatrix();

	labelRenderer = new CSS2DRenderer();
	labelRenderer.setSize(renderSize.x, renderSize.y);
	labelRenderer.domElement.style.position = 'absolute';
	labelRenderer.domElement.style.top = '8px';
	labelRenderer.domElement.id = 'labelLayer';
	document.getElementById('container').appendChild(labelRenderer.domElement);

	let canvasRef = document.getElementById('threeScene');
		
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true,
		canvas:canvasRef,
		preserveDrawingBuffer: true 
	});
	renderer.setPixelRatio(1);
	renderer.setSize(renderSize.x, renderSize.y);

	scene = new THREE.Scene();
	
	finalCanvas = document.getElementById('finalCanvas');
	finalViewCtx = finalCanvas.getContext('2d');
	
	finalCanvas.setAttribute('width',renderSize.x);
	finalCanvas.setAttribute('height',renderSize.y);
	
	layer2dImage.onload = () => {
		finalViewCtx.drawImage(layer2dImage,0,0);
		console.log("Update layer2dImage");
		checkFinishUpdate();
	};
	
	layerMainImage.onload = () => {
		finalViewCtx.drawImage(layerMainImage,0,0);
		console.log("Update layerMainImage");
		checkFinishUpdate();
	};
	create();

	control = new OrbitControls(currentCamera,document.getElementById('labelLayer'));
	render();
}

function render() {
	requestAnimationFrame(render);
	control.update();
	renderer.render(scene, currentCamera);
	labelRenderer.render(scene, currentCamera);
	// updateNode();
}

function saveFile(dataURL,fileName="CaptureNode_" + DateTime.getTime()+".png")
{
	DowonloadLink.download = fileName; // 使用时间戳给文件命名
	DowonloadLink.href = dataURL;
	DowonloadLink.click();
}

function saveNode() {
	const target = document.getElementById("container");	
	// 生成图片并上传到数据库保存
	html2canvas(target, h2cSetting).then((canvas) => {
		let dataURL = canvas.toDataURL("image/png"); // 拿到数据流
		saveFile(dataURL);
	});
}

function updateNode()
{
	const target = document.getElementById("labelLayer");
	const rect = target.getBoundingClientRect();
	h2cSetting.scrollY = rect.bottom;
	h2cSetting.height = rect.height;
	

	// 生成图片并上传到数据库保存
	html2canvas(target, h2cSetting).then((canvas) => {

		let dataURL = canvas.toDataURL("image/png"); // 拿到数据流
		layer2dImage.src=dataURL;
		
		let mainCanvasURL = renderer.domElement.toDataURL();
		layerMainImage.src = mainCanvasURL;
	});
}

function saveFinalView() {
	IsCheckUpdate=true;
	UpdateProcess=2;
	updateNode();
}

function checkFinishUpdate()
{
	if(!IsCheckUpdate){return;}
	UpdateProcess--;
	if(UpdateProcess == 0)
	{
		IsCheckUpdate = false;
		html2canvas(document.getElementById("finalView"), h2cSetting).then((canvas) => {
			let dataURL = canvas.toDataURL("image/png"); // 拿到数据流
			saveFile(dataURL);
		});
	}
}


init();

document.getElementById("btnSave").addEventListener('click', saveFinalView);
document.getElementById("btnUpdate").addEventListener('click', updateNode);