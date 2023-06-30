import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {
	MeshBasicMaterial,
	Object3D,
	BoxGeometry,
	BufferGeometry,
	CylinderGeometry,
	Line,
	LineBasicMaterial,
	Float32BufferAttribute,
	SphereGeometry,
	Mesh,
	TextGeometry
} from 'three';

class BaseLine extends Object3D {
				constructor() {
					super();
					this.type = 'BaseLine';
					const gizmoMaterial = new MeshBasicMaterial({
						depthTest: false,
						depthWrite: false,
						fog: false,
						toneMapped: false,
						transparent: true
					});

					const gizmoLineMaterial = new LineBasicMaterial({
						depthTest: false,
						depthWrite: false,
						fog: false,
						toneMapped: false,
						transparent: true
					});
					
					const matRed = gizmoMaterial.clone();
					matRed.color.setHex( 0xff0000 );
					
					const matGreen = gizmoMaterial.clone();
					matGreen.color.setHex( 0x00ff00 );
					
					const matBlue = gizmoMaterial.clone();
					matBlue.color.setHex( 0x0000ff );

					const arrowGeometry = new CylinderGeometry(0, 0.04, 0.1, 12);
					arrowGeometry.translate(0, 0.05, 0);

					const lineGeometry2 = new CylinderGeometry( 0.0075, 0.0075, 0.5, 3 );
					lineGeometry2.translate( 0, 0.25, 0 );
					
					const labelXDiv = document.createElement( 'div' );
					labelXDiv.className = 'label';
					labelXDiv.style.fontSize = '2em';
					labelXDiv.style.color = '#F00';
					labelXDiv.textContent = 'X';
					
					const labelYDiv = labelXDiv.cloneNode(true);
					labelYDiv.style.color = '#0F0';
					labelYDiv.textContent='Y';
					
					const labelZDiv = labelXDiv.cloneNode(true);
					labelZDiv.style.color = '#00F';
					labelZDiv.textContent='Z';
					
					const textMeshSetting = {
						
					};

					const gizmoTranslate = {
						X: [
							[new Mesh(arrowGeometry, matRed), [0.5, 0, 0],
								[0, 0, -Math.PI / 2]
							],
							[new Mesh(lineGeometry2, matRed), [0, 0, 0],
								[0, 0, -Math.PI / 2]
							],
							[new CSS2DObject(labelXDiv),[0.5,0.075,0]]
						],
						Y: [
							[new Mesh(arrowGeometry, matGreen), [0, 0.5, 0]],
							[new Mesh(lineGeometry2, matGreen)],
							[new CSS2DObject(labelYDiv),[0.075,0.5,0]]
						],
						Z: [
							[new Mesh(arrowGeometry, matBlue), [0, 0, 0.5],
								[Math.PI / 2, 0, 0]
							],
							[new Mesh(lineGeometry2, matBlue), null, [Math.PI / 2, 0, 0]],
							[new CSS2DObject(labelZDiv),[0.075,0,0.5]]
						]
					};

					function setupGizmo(gizmoMap) {

						const gizmo = new Object3D();

						for (const name in gizmoMap) {

							for (let i = gizmoMap[name].length; i--;) {

								const object = gizmoMap[name][i][0].clone();
								const position = gizmoMap[name][i][1];
								const rotation = gizmoMap[name][i][2];
								const scale = gizmoMap[name][i][3];
								const tag = gizmoMap[name][i][4];

								// name and tag properties are essential for picking and updating logic.
								object.name = name;
								object.tag = tag;

								if (position) {

									object.position.set(position[0], position[1], position[2]);

								}

								if (rotation) {

									object.rotation.set(rotation[0], rotation[1], rotation[2]);

								}

								if (scale) {

									object.scale.set(scale[0], scale[1], scale[2]);

								}

								object.updateMatrix();
								
								if(object.geometry)
								{
									const tempGeometry = object.geometry.clone();
									tempGeometry.applyMatrix4(object.matrix);
									object.geometry = tempGeometry;
									object.renderOrder = Infinity;
									
									object.position.set(0, 0, 0);
									object.rotation.set(0, 0, 0);
									object.scale.set(1, 1, 1);
								}
								
								gizmo.add(object);

							}

						}

						return gizmo;

					}
					
					this.gizmo = {};
					this.add( this.gizmo[ 'translate' ] = setupGizmo( gizmoTranslate ) );
				}
			}

export { BaseLine };