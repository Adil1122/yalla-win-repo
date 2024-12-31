import { useEffect, useMemo, useRef, forwardRef, useImperativeHandle, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Group, MeshStandardMaterial, LoopOnce, Vector3 } from "three"
import { useAnimations, useGLTF, useTexture } from "@react-three/drei"

interface ModalProps {
   onLoaded: () => void
   onEnded: () => void
   texturess: any
   animationType: any
   machineNumber: any
}

const Modal = forwardRef(({ onLoaded, onEnded, texturess, animationType, machineNumber }: ModalProps, ref) => {
   const group = useRef<Group>(null)
   const { nodes, materials, animations, scene } = useGLTF("/assets/animations/"+animationType+"_new.glb")
   const textures : any = useTexture(texturess)
   const [ballOutAnimation, setBallOutAnimation] = useState<any>()
   const length = animationType == 'yalla_6' ? 26 : 10

   useEffect(() => {

      let materialNames : string[]

      materialNames = [
         'Stick.002',
         'Wood Floor.002',
         'SUMSUNG logo.002',
         'Plastic.002',
         'Metal.002'
      ]

      materialNames.forEach((materialName : string, index: number) => {
         const material = materials[materialName] as MeshStandardMaterial | undefined
         const texture : any = textures[index]
   
         if (material && texture) {
            console.log('applied textures')
           material.map = texture
           material.needsUpdate = true
         }
      })

      setBallOutAnimation({ action: actions["ball_7.001Action"], name: "out_1" })
   }, [])

   const { camera } = useThree()
   const [animationFinished, setAnimationFinished] = useState(false)

   const { actions } = useAnimations(animations, scene)
   const ballAnimations = Array.from({ length: length }, (_, i) => actions[`ball_${i}Action`])
   const targetPosition = new Vector3(-1, 3, 0)

   // Expose startAnimation method to parent component
   useImperativeHandle(ref, () => ({
      startAnimation: () => {

         if (ballOutAnimation) {
            
            ballOutAnimation.action.clampWhenFinished = true
            ballOutAnimation.action.setLoop(LoopOnce, 1)
            ballOutAnimation.action.reset().play()
            console.log(`Animation '${ballOutAnimation.name}' started`)
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

      console.log(actions)
      console.log(materials)

      if (onLoaded) {
         onLoaded()
      }

      return () => {

         if (ballOutAnimation) {
            ballOutAnimation.action.stop()
         }
      }
   }, [actions, textures, materials])

   useFrame(() => {

      if (ballOutAnimation) {
         // Check if the animation is near the end of its duration
         if (ballOutAnimation.action.getClip().duration - ballOutAnimation.action.time < 0.00001) {
            console.log("Animation has ended")
            setAnimationFinished(true)
         }
      }

      if (animationFinished) {
         const currentPosition = camera.position.clone()
         currentPosition.lerp(targetPosition, 0.05)
         camera.position.copy(currentPosition)
         camera.lookAt(0, 0, 0)

         if (camera.position.distanceTo(targetPosition) < 0.01) {
            console.log("Camera has reached the target position")
            onEnded()
            setAnimationFinished(false)
         }
      }
   })

   return (
      <group ref={group} position={[-1, -7, 0]}>
         <primitive object={scene} />
      </group>
   )
})

Modal.displayName = "Modal"

export default Modal