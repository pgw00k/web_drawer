import * as THREE from 'three';
import {
	CSS2DRenderer,
	CSS2DObject
} from 'three/examples/jsm/renderers/CSS2DRenderer.js';

import html2canvas from 'html2canvas';

import {
	BaseLine
} from './BaseLine.js';

let cameraPersp, cameraOrtho, currentCamera;
let scene, renderer, control, orbit, labelRenderer, loadedFont;

let layer2dImage = new Image();
let layerMainImage = new Image();
let renderSize = {x:512,y:512};
let DateTime = new Date();
let DowonloadLink = document.createElement("a"); // 创建一个a标签

let finalCanvas,finalViewCtx;

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
		backgroundColor: null // 保证获取的图片是透明的
};

function create() {
	let baseLine = new BaseLine();
	scene.add(baseLine);

	baseLine.scale.set(-1, 1, 1);
}

function init() {

	const aspect = 1;
	let orthoWidth = 0.4;

	cameraPersp = new THREE.PerspectiveCamera(60, aspect, 0.01, 30000);
	cameraOrtho = new THREE.OrthographicCamera(-orthoWidth * aspect, orthoWidth * aspect, orthoWidth, -orthoWidth, 0.01,
		30000);
	cameraOrtho.zoom = 1.2;
	currentCamera = cameraOrtho;
	
	currentCamera.position.set(-0.55, 0.82,-1.2);
	currentCamera.rotation.set(-2.73,-0.2, -3.1);

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
	//document.getElementById('container').appendChild(renderer.domElement);

	scene = new THREE.Scene();
	
	finalCanvas = document.getElementById('finalView');
	finalViewCtx = finalCanvas.getContext('2d');
	
	finalCanvas.setAttribute('width',renderSize.x);
	finalCanvas.setAttribute('height',renderSize.y);
	
	layer2dImage.onload = () => {
		finalViewCtx.drawImage(layer2dImage,0,0);
		console.log("Update layer2dImage");
	};
	
	layerMainImage.onload = () => {
		finalViewCtx.drawImage(layerMainImage,0,0);
		console.log("Update layerMainImage");
	};
	
	create();
}

function render() {
	renderer.render(scene, currentCamera);
	labelRenderer.render(scene, currentCamera);
}

function firstRender()
{
	render();
	
	const rect = document.getElementById("labelLayer").getBoundingClientRect();
	h2cSetting.scrollY = rect.bottom;
	h2cSetting.height = rect.height;
	updateNode();
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
	// 生成图片并上传到数据库保存
	html2canvas(target, h2cSetting).then((canvas) => {
		let dataURL = canvas.toDataURL("image/png"); // 拿到数据流
		layer2dImage.src=dataURL;
		
		let mainCanvasURL = renderer.domElement.toDataURL();
		layerMainImage.src = mainCanvasURL;
	});
}

function saveFinalView() {
	let target = document.getElementById("finalView");
	let dataURL = target.toDataURL("image/png");
	saveFile(dataURL);
}


init();
firstRender();

document.getElementById("btnSave").addEventListener('click', saveFinalView);