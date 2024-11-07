import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Group, MeshStandardMaterial, LoopOnce, Vector3 } from "three"
import { useAnimations, useGLTF, useTexture } from "@react-three/drei"

interface ModalProps {
   onLoaded: () => void
   texturess: any
}

const Modal = forwardRef(({ onLoaded, texturess }: ModalProps, ref) => {
   const group = useRef<Group>(null)
   const { nodes, materials, animations, scene } = useGLTF("/assets/animations/new_06.glb")
   const materialNames = ["dummy", "dummy.001", "dummy.002", "dummy.003", "dummy.004", "dummy.005"]
   const { camera } = useThree()
   const [animationFinished, setAnimationFinished] = useState(false)

   const { actions } = useAnimations(animations, scene)
   const textures : any = useTexture(texturess)
   const rotationAnim = actions["Cylinder.012Action.001"]
   const ballOutAnimations = [
      { action: actions["ball_out_1"], name: "out_1" },
      { action: actions["ball_out_2"], name: "out_2" },
      { action: actions["ball_out_3"], name: "out_3" },
      { action: actions["ball_out_4"], name: "out_4" },
      { action: actions["ball_out_5"], name: "out_5" },
      { action: actions["ball_out_6"], name: "out_6" },
   ]
   const ballAnimations = Array.from({ length: 26 }, (_, i) => actions[`ball.${i}Action`])
   const targetPosition = new Vector3(-2, 0, 1)

   useImperativeHandle(ref, () => ({
      startAnimation: () => {
         ballOutAnimations.forEach(({ action }) => {
            if (action) action.reset().stop()
         })
         if (rotationAnim) {
            rotationAnim.clampWhenFinished = true
            rotationAnim.setLoop(LoopOnce, 1)
            rotationAnim.reset().play()
            console.log("Wheel animation has started")
         }
         ballAnimations.forEach((ballAnim) => {
            if (ballAnim) {
               ballAnim.clampWhenFinished = true
               ballAnim.setLoop(LoopOnce, 1)
               ballAnim.reset().play()
            }
         })
      }
   }))

   useEffect(() => {
      materialNames.forEach((materialName, index) => {
         const material = materials[materialName] as MeshStandardMaterial | undefined
         const texture = textures[index]
         if (material && texture) {
            material.map = texture
            material.needsUpdate = true
         }
      })

      if (onLoaded) {
         onLoaded()
      }

      return () => {
         // Clean up animations
         rotationAnim?.stop()
         ballAnimations.forEach((ballAnim) => ballAnim?.stop())
         ballOutAnimations.forEach(({ action }) => action?.stop())

         // Dispose of textures
         textures.forEach((texture: any) => texture.dispose())
         
         console.log("Modal resources have been cleaned up")
      }

   }, [onLoaded, actions, textures, materials])

   useFrame(() => {
      if (rotationAnim) {
         if (rotationAnim.getClip().duration - rotationAnim.time < 0.00001) {
            console.log("Wheel animation has ended")
            rotationAnim.stop()

            setAnimationFinished(true)
            ballOutAnimations.forEach(({ action, name }) => {
               if (action) {
                  action.clampWhenFinished = true
                  action.setLoop(LoopOnce, 1)
                  action.reset().play()
                  console.log(`Animation '${name}' started`)
               }
            })
         }
      }

      if (animationFinished) {
         const currentPosition = camera.position.clone()
         currentPosition.lerp(targetPosition, 0.05)
         camera.position.copy(currentPosition)
         camera.lookAt(0, 0, 0)

         if (camera.position.distanceTo(targetPosition) < 0.01) {
            console.log("Camera has reached the target position")
            setAnimationFinished(false)
         }
      }
   })

   return (
      <group ref={group} position={[0, -5, 0]}>
         <primitive object={scene} />
      </group>
   )
})

Modal.displayName = "Modal"

export default Modal
