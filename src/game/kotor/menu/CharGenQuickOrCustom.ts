import { GameState } from "../../../GameState";
import { GameMenu } from "../../../gui";
import type { GUIListBox, GUILabel, GUIButton } from "../../../gui";
import { TalentFeat } from "../../../talents";

/**
 * CharGenQuickOrCustom class.
 * 
 * KotOR JS - A remake of the Odyssey Game Engine that powered KotOR I & II
 * 
 * @file CharGenQuickOrCustom.ts
 * @author KobaltBlu <https://github.com/KobaltBlu>
 * @license {@link https://www.gnu.org/licenses/gpl-3.0.txt|GPLv3}
 */
export class CharGenQuickOrCustom extends GameMenu {

  LBL_DECORATION: GUILabel;
  BTN_BACK: GUIButton;
  LBL_RBG: GUILabel;
  LB_DESC: GUIListBox;
  QUICK_CHAR_BTN: GUIButton;
  CUST_CHAR_BTN: GUIButton;

  constructor(){
    super();
    this.gui_resref = 'qorcpnl';
    this.background = '';
    this.voidFill = false;
  }

  async menuControlInitializer(skipInit: boolean = false) {
    await super.menuControlInitializer();
    if(skipInit) return;
    return new Promise<void>((resolve, reject) => {
      this.QUICK_CHAR_BTN.addEventListener('click', (e) => {
        e.stopPropagation();
        try{
          const creature = GameState.CharGenManager.selectedCreature;
          if(!creature){
            console.warn('CharGenQuickOrCustom: selected creature missing for quick character setup');
            return;
          }
          const class_data = GameState.SWRuleSet.classes[GameState.CharGenManager.selectedClass];
          if(!class_data){
            console.warn('CharGenQuickOrCustom: class data missing for selected class', GameState.CharGenManager.selectedClass);
            return;
          }
          const saving_throw_label = class_data['savingthrowtable'].toLowerCase();
          const saving_throw_table = GameState.TwoDAManager.datatables.get(saving_throw_label);
          const saving_throw_data = saving_throw_table?.rows[0];
          const feats_table = GameState.SWRuleSet.feats;

          creature.str = class_data.str;
          creature.dex = class_data.dex;
          creature.con = class_data.con;
          creature.wis = class_data.wis;
          creature.int = class_data.int;
          creature.cha = class_data.cha;
          creature.str = class_data.str;

          creature.fortbonus = parseInt(saving_throw_data?.fortsave ?? '0');
          creature.willbonus = parseInt(saving_throw_data?.willsave ?? '0');
          creature.refbonus = parseInt(saving_throw_data?.refsave ?? '0');

          for(let i = 0, len = feats_table.length; i < len; i++){
            const feat_data = feats_table[i];
            if(feat_data.getGranted(class_data) == 1){
              creature.feats.push(new TalentFeat(i));
            }
          }
          
          this.manager.CharGenMain.close();
          this.manager.CharGenMain.childMenu = this.manager.CharGenQuickPanel;
          this.manager.CharGenQuickPanel.tGuiPanel.widget.position.x = 142.5;
          this.manager.CharGenQuickPanel.tGuiPanel.widget.position.y = 0;
          this.manager.CharGenMain.open();
        }catch(e){
          console.error(e);
        }
      });

      this.CUST_CHAR_BTN.addEventListener('click', (e) => {
        e.stopPropagation();
        //Game.CharGenMain.state = CharGenMain.STATES.CUSTOM;
        //Game.CharGenCustomPanel.Show();
        this.manager.CharGenMain.close();
        this.manager.CharGenMain.childMenu = this.manager.CharGenCustomPanel;
        this.manager.CharGenCustomPanel.tGuiPanel.widget.position.x = 142.5;
        this.manager.CharGenCustomPanel.tGuiPanel.widget.position.y = 0;
        this.manager.CharGenMain.open();

        //Reset the Attributes window
        this.manager.CharGenAbilities.reset();

        //Reset the Skills window
        this.manager.CharGenSkills.reset();
      });

      this.BTN_BACK.addEventListener('click', (e) => {
        e.stopPropagation();
        //Game.CharGenMain.Hide();

        try{
          GameState.CharGenManager.selectedCreature?.model?.parent?.remove(GameState.CharGenManager.selectedCreature.model);
        }catch(e){}

        // this.manager.CharGenClass.getControlByName('_3D_MODEL'+(GameState.CharGenManager.selectedClass+1))
        //  .userData._3dView.scene.add(GameState.CharGenManager.selectedCreature.model);
        this.manager.CharGenMain.close();
      });

      //Hide because this submenu is very incomplete.
      //Comment out this line to work on the custom chargen screen
      this.CUST_CHAR_BTN.hide();

      this.tGuiPanel.offset.x = -180;
      this.tGuiPanel.offset.y = 100;
      this.recalculatePosition();
      resolve();
    });
  }
  
}
